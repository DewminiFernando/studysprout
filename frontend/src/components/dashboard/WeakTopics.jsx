import { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { quizAPI } from '../../services/api';

function WeakTopics() {
  const [weakTopics, setWeakTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeakTopics = async () => {
      try {
        const response = await quizAPI.getWeakTopics();
        setWeakTopics(response.data || []);
      } catch (err) {
        console.error('Failed to fetch weak topics details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWeakTopics();
  }, []);

  if (loading) {
    return (
      <div className="bg-white border border-[#D6E4D8] rounded-[10px] p-3 px-3.5">
        <div className="text-[13px] font-medium text-ss-text mb-1.5">Topics to revise</div>
        <div className="text-xs text-ss-muted animate-pulse">Loading topics...</div>
      </div>
    );
  }

  // Filter or take weak topics. The API already filters to where weak_answers > 0.
  const displayTopics = weakTopics;

  return (
    <div className="bg-white border border-[#D6E4D8] rounded-[10px] p-3 px-3.5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[13px] font-medium text-ss-text">
          Topics to revise
        </span>
        {displayTopics.length > 0 && (
          <Link
            to="/analytics#weak-topics"
            className="text-[11px] text-ss-green cursor-pointer hover:underline no-underline"
          >
            See all →
          </Link>
        )}
      </div>

      {displayTopics.length === 0 ? (
        <div className="text-left py-2 text-xs text-ss-muted italic">
          No weak topics detected. 🌱 Practice quizzes to find areas of improvement!
        </div>
      ) : (
        <div className="space-y-1">
          {displayTopics.map((wt, idx) => {
            const pct = Math.round((wt.weakness_rate || 0) * 100);
            
            // Severity determination
            let color = '#4A7558'; // low
            if (wt.weakness_rate >= 0.6) {
              color = '#E24B4A'; // high
            } else if (wt.weakness_rate >= 0.3) {
              color = '#EF9F27'; // med
            }

            return (
              <div
                key={wt.topic || idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 0',
                  borderBottom: idx === displayTopics.length - 1 ? 'none' : '0.5px solid #EEF2EF',
                }}
              >
                {/* Dot */}
                <div
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    flexShrink: 0,
                  }}
                />

                {/* Name */}
                <div
                  style={{
                    fontSize: '12px',
                    color: 'var(--ss-text)',
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {wt.topic}
                </div>

                {/* Bar bg */}
                <div
                  style={{
                    width: '60px',
                    backgroundColor: '#F0EDE8',
                    borderRadius: '4px',
                    height: '5px',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  {/* Bar fill */}
                  <div
                    style={{
                      backgroundColor: color,
                      width: `${pct}%`,
                      height: '100%',
                      borderRadius: '4px',
                    }}
                  />
                </div>

                {/* Pct */}
                <div
                  style={{
                    fontSize: '10px',
                    color: 'var(--ss-muted)',
                    width: '28px',
                    textAlign: 'right',
                    flexShrink: 0,
                  }}
                >
                  {pct}%
                </div>
              </div>
            );
          })}

          {/* Inline alert if exactly 1 weak topic */}
          {displayTopics.length === 1 && (
            <div
              style={{
                background: '#FCEBEB',
                borderRadius: '8px',
                padding: '8px 10px',
                fontSize: '11px',
                color: '#791F1F',
                display: 'flex',
                alignItems: 'start',
                gap: '6px',
                marginTop: '10px',
              }}
            >
              <Info size={14} style={{ color: '#E24B4A', marginTop: '1px', flexShrink: 0 }} />
              <div style={{ lineHeight: 1.4 }}>
                Reviewing <strong>{displayTopics[0].topic}</strong> will boost your score the fastest.{' '}
                <Link
                  to={`/quiz?topic=${encodeURIComponent(displayTopics[0].topic)}`}
                  style={{
                    color: '#A32D2D',
                    textDecoration: 'underline',
                    fontWeight: 500,
                  }}
                >
                  Start targeted quiz →
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default WeakTopics;

