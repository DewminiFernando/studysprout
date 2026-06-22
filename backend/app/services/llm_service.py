import os
import json
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

# Load environment variables from backend/.env
load_dotenv()

# Maximum characters to send to the LLM (prevents token limit issues)
MAX_TEXT_CHARS = 18000


def get_llm():
    """
    Creates and returns a ChatGroq LLM client.
    Reads GROQ_API_KEY and GROQ_MODEL from environment variables.
    Falls back to llama-3.1-8b-instant if GROQ_MODEL is not set.
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY is not set in environment variables.")

    model = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")

    return ChatGroq(
        api_key=api_key,
        model=model,
        temperature=0.2,
        max_retries=2,
    )


def limit_pdf_text(text: str, max_chars: int = MAX_TEXT_CHARS) -> str:
    """
    Truncates PDF text to a maximum number of characters.
    This prevents exceeding LLM token limits for very large documents.
    """
    if not text:
        return ""
    if len(text) <= max_chars:
        return text
    return text[:max_chars]


def generate_study_guideline(pdf_text: str) -> dict:
    """
    Generates a structured study guideline from PDF text using Groq LLM.
    Returns a dictionary with: overview, key_topics, study_order,
    important_definitions, exam_focused_areas, revision_tips.
    """
    llm = get_llm()
    parser = JsonOutputParser()

    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a helpful study assistant AI. Your task is to generate a structured study guideline from the given lecture/PDF text.

Rules:
- Use only the provided PDF text. Do not invent unrelated content.
- Make the guideline beginner-friendly and exam-focused.
- Return ONLY valid JSON. No markdown, no explanation outside JSON.
- Follow the exact JSON structure below.

Return this exact JSON structure:
{{
  "overview": "A short overview of what the PDF covers",
  "key_topics": ["topic 1", "topic 2", "topic 3"],
  "study_order": ["step 1: study this first", "step 2: then study this"],
  "important_definitions": ["definition 1: explanation", "definition 2: explanation"],
  "exam_focused_areas": ["area 1", "area 2"],
  "revision_tips": ["tip 1", "tip 2"]
}}"""),
        ("human", "Here is the PDF text to analyze:\n\n{pdf_text}")
    ])

    limited_text = limit_pdf_text(pdf_text)
    chain = prompt | llm | parser

    try:
        result = chain.invoke({"pdf_text": limited_text})
        return result
    except Exception as e:
        # If JSON parsing fails, try to extract from raw response
        try:
            raw_chain = prompt | llm
            raw_result = raw_chain.invoke({"pdf_text": limited_text})
            content = raw_result.content if hasattr(raw_result, "content") else str(raw_result)
            # Try to find JSON in the response
            start = content.find("{")
            end = content.rfind("}") + 1
            if start != -1 and end > start:
                return json.loads(content[start:end])
        except Exception:
            pass
        raise ValueError(f"Failed to generate study guideline: {str(e)}")


def generate_question_bank(pdf_text: str, question_count: int = 10) -> list:
    """
    Generates a bank of exam-style questions from PDF text using Groq LLM.
    Returns a list of question dictionaries, each with: topic, question_type,
    difficulty, question_text, correct_answer, explanation.
    """
    llm = get_llm()
    parser = JsonOutputParser()

    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a helpful exam question generator AI. Your task is to generate exam-style questions from the given lecture/PDF text.

Rules:
- Generate questions ONLY from the provided PDF text.
- Include a mix of question types: mcq, short-answer, explain-type, true/false, identify-type, scenario-based.
- Include topic, question_type, difficulty, question_text, correct_answer, and explanation for each question.
- Keep explanations student-friendly.
- Return ONLY valid JSON. No markdown, no extra text outside JSON.
- Follow the exact JSON structure below.

Return this exact JSON structure:
{{
  "questions": [
    {{
      "topic": "topic name from the PDF",
      "question_type": "mcq | short-answer | explain-type | true/false | identify-type | scenario-based",
      "difficulty": "easy | medium | hard",
      "question_text": "the question here",
      "correct_answer": "the correct answer here",
      "explanation": "why this answer is correct, explained simply"
    }}
  ]
}}

Generate exactly {question_count} questions with mixed types and difficulties."""),
        ("human", "Here is the PDF text to generate questions from:\n\n{pdf_text}")
    ])

    limited_text = limit_pdf_text(pdf_text)
    chain = prompt | llm | parser

    try:
        result = chain.invoke({
            "pdf_text": limited_text,
            "question_count": question_count,
        })
        # The result should have a "questions" key
        if isinstance(result, dict) and "questions" in result:
            return result["questions"]
        elif isinstance(result, list):
            return result
        else:
            raise ValueError("Unexpected response format from LLM.")
    except Exception as e:
        # If JSON parsing fails, try to extract from raw response
        try:
            raw_chain = prompt | llm
            raw_result = raw_chain.invoke({
                "pdf_text": limited_text,
                "question_count": question_count,
            })
            content = raw_result.content if hasattr(raw_result, "content") else str(raw_result)
            start = content.find("{")
            end = content.rfind("}") + 1
            if start != -1 and end > start:
                parsed = json.loads(content[start:end])
                if isinstance(parsed, dict) and "questions" in parsed:
                    return parsed["questions"]
                return [parsed]
        except Exception:
            pass
        raise ValueError(f"Failed to generate question bank: {str(e)}")
