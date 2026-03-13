"use client";
import { useState, useEffect, useCallback, useRef } from "react";

const STARTUPS = [
  {
    desc: "Một anh chàng bán giày online nhưng không có hàng. Khi có đơn, anh ta chạy ra cửa hàng mua rồi ship cho khách.",
    year: "1999",
    ask: "$500K",
    success: true,
    name: "Zappos",
    result: "Bán cho Amazon $1.2 TỶ (2009)",
    lesson: "MVP — test nhu cầu trước khi xây hệ thống!",
    emoji: "👟",
  },
  {
    desc: "2 anh chàng hết tiền trả nhà, mua nệm hơi cho khách ngủ tạm giá $80/đêm. Khách là người lạ hoàn toàn.",
    year: "2007",
    ask: "$20K",
    success: true,
    name: "Airbnb",
    result: "Trị giá $75 TỶ — không sở hữu căn phòng nào!",
    lesson: "Sharing Economy — chia sẻ tài nguyên nhàn rỗi",
    emoji: "🏠",
  },
  {
    desc: "Một startup tạo máy ép nước trái cây 'thông minh' giá $400, kết nối WiFi. Nhưng tay người ép cũng được.",
    year: "2013",
    ask: "$120M",
    success: false,
    name: "Juicero",
    result: "Phá sản sau 16 tháng — đốt $120M 💀",
    lesson: "Không ai cần máy ép juice $400 khi tay ép cũng xong!",
    emoji: "🧃",
  },
  {
    desc: "Một mạng xã hội chỉ cho post tối đa 140 ký tự. Ai cũng nói 'ai mà xài cái này?'",
    year: "2006",
    ask: "$5M",
    success: true,
    name: "Twitter (X)",
    result: "Elon Musk mua $44 TỶ (2022)",
    lesson: "Đơn giản = mạnh mẽ. Constraint tạo sáng tạo!",
    emoji: "🐦",
  },
  {
    desc: "Startup dùng drone giao MÁU ở châu Phi. Bệnh viện ở vùng sâu đặt hàng qua tin nhắn, drone bay tới trong 30 phút.",
    year: "2014",
    ask: "$18M",
    success: true,
    name: "Zipline",
    result: "Trị giá $4.2 TỶ — cứu hàng ngàn mạng người",
    lesson: "Startup không chỉ kiếm tiền — còn cứu người!",
    emoji: "🩸",
  },
  {
    desc: "Kính thông minh có camera, giá $1,500. Người đeo bị gọi là 'Glasshole'. Quán bar cấm đeo vào.",
    year: "2013",
    ask: "Nội bộ Google",
    success: false,
    name: "Google Glass",
    result: "Ngừng bán cho người dùng — thất bại về mặt xã hội",
    lesson: "Công nghệ tốt ≠ sản phẩm tốt. Cần product-market fit!",
    emoji: "👓",
  },
];

const TEAMS = [
  { name: "Nhóm A", color: "#6C5CE7", emoji: "🦈" },
  { name: "Nhóm B", color: "#00B894", emoji: "🐉" },
  { name: "Nhóm C", color: "#E17055", emoji: "🦁" },
];

type Phase = "splash" | "intro" | "pitch" | "countdown" | "vote" | "reveal" | "scores" | "final";

export default function GamePage() {
  const [phase, setPhase] = useState<Phase>("splash");
  const [round, setRound] = useState(0);
  const [scores, setScores] = useState([0, 0, 0]);
  const [votes, setVotes] = useState<(boolean | null)[]>([null, null, null]);
  const [timer, setTimer] = useState(15);
  const [revealed, setRevealed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtx = useRef<AudioContext | null>(null);

  const playBeep = useCallback((freq: number, dur: number) => {
    try {
      if (!audioCtx.current) audioCtx.current = new AudioContext();
      const osc = audioCtx.current.createOscillator();
      const gain = audioCtx.current.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.current.destination);
      osc.frequency.value = freq;
      gain.gain.value = 0.1;
      osc.start();
      setTimeout(() => osc.stop(), dur);
    } catch {}
  }, []);

  const startCountdown = useCallback(() => {
    setPhase("countdown");
    setTimer(15);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase("vote");
          return 0;
        }
        if (t <= 4) playBeep(800, 100);
        return t - 1;
      });
    }, 1000);
  }, [playBeep]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleVote = (teamIdx: number, invest: boolean) => {
    const newVotes = [...votes];
    newVotes[teamIdx] = invest;
    setVotes(newVotes);
  };

  const allVoted = votes.every((v) => v !== null);

  const doReveal = () => {
    setRevealed(true);
    const startup = STARTUPS[round];
    const newScores = [...scores];
    votes.forEach((v, i) => {
      if (v === true && startup.success) newScores[i] += 100;
      else if (v === true && !startup.success) newScores[i] -= 50;
      else if (v === false && !startup.success) newScores[i] += 30;
      else if (v === false && startup.success) newScores[i] -= 100;
    });
    setScores(newScores);
    playBeep(startup.success ? 523 : 200, 300);
    setPhase("reveal");
  };

  const nextRound = () => {
    if (round >= STARTUPS.length - 1) {
      setPhase("final");
      return;
    }
    setRound((r) => r + 1);
    setVotes([null, null, null]);
    setRevealed(false);
    setPhase("pitch");
  };

  const startup = STARTUPS[round];
  const maxScore = Math.max(...scores);
  const winnerIdx = scores.indexOf(maxScore);

  return (
    <div style={{
      width: "100vw", height: "100vh", background: "#0a0a1a",
      fontFamily: "'Inter', sans-serif", color: "#f0f0f5",
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden", position: "relative",
    }}>
      {/* Background glow */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "#6C5CE7", filter: "blur(120px)", opacity: 0.08, top: "-10%", left: "-5%", animation: "floatShape 20s infinite ease-in-out" }} />
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "#00B894", filter: "blur(120px)", opacity: 0.08, bottom: "-10%", right: "-5%", animation: "floatShape 20s infinite ease-in-out 5s" }} />
      </div>

      {/* SCOREBOARD — always visible except intro/splash */}
      {phase !== "intro" && phase !== "splash" && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          display: "flex", justifyContent: "center", gap: 24, padding: "12px 20px",
          background: "rgba(10,10,26,.9)", backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,.06)",
        }}>
          <div style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", fontSize: ".75rem", color: "#666" }}>
            🎮 Round {round + 1}/{STARTUPS.length}
          </div>
          {TEAMS.map((team, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "6px 16px",
              borderRadius: 50, background: `rgba(${team.color === "#6C5CE7" ? "108,92,231" : team.color === "#00B894" ? "0,184,148" : "225,112,85"},.1)`,
              border: `1px solid ${team.color}33`,
            }}>
              <span style={{ fontSize: "1.2rem" }}>{team.emoji}</span>
              <span style={{ fontSize: ".8rem", fontWeight: 700, color: team.color }}>{team.name}</span>
              <span style={{
                fontSize: "1.1rem", fontWeight: 900, color: scores[i] >= 0 ? "#00B894" : "#E17055",
                transition: "all .5s", minWidth: 60, textAlign: "right",
              }}>
                ${scores[i]}M
              </span>
            </div>
          ))}
        </div>
      )}

      {/* SPLASH — cinematic title slam */}
      {phase === "splash" && (
        <div
          onClick={() => setPhase("intro")}
          style={{
            textAlign: "center", cursor: "pointer",
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            zIndex: 20,
          }}
        >
          <div style={{ fontSize: "5rem", animation: "sharkDrop .8s cubic-bezier(.16,1,.3,1) forwards, sharkPulse 2s ease-in-out 1.2s infinite" }}>🦈</div>
          <h1 style={{
            fontSize: "5.5rem", fontWeight: 900, fontFamily: "'Playfair Display', serif",
            animation: "titleSlam .7s cubic-bezier(.16,1,.3,1) .3s backwards",
            marginBottom: 8,
          }}>
            Shark Tank
          </h1>
          <h1 style={{
            fontSize: "6rem", fontWeight: 900, fontFamily: "'Playfair Display', serif",
            background: "linear-gradient(135deg,#6C5CE7,#00B894,#FDCB6E,#E17055)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            animation: "titleSlam .7s cubic-bezier(.16,1,.3,1) .6s backwards",
            lineHeight: 1.1,
          }}>
            Battle
          </h1>
          <p style={{
            fontSize: "1rem", color: "#555", marginTop: 40,
            animation: "fadeInUp .5s ease 1.5s backwards",
            letterSpacing: 2,
          }}>
            Nhấn để tiếp tục...
          </p>
        </div>
      )}

      {/* INTRO — teams, rules, start button */}
      {phase === "intro" && (
        <div style={{ textAlign: "center", maxWidth: 700, padding: 40 }}>
          <div style={{ animation: "shrinkTitle .6s cubic-bezier(.4,0,.2,1) forwards", marginBottom: 12 }}>
            <div style={{ fontSize: "2rem", marginBottom: 6 }}>🦈</div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 900, fontFamily: "'Playfair Display', serif" }}>
              Shark Tank <span style={{ background: "linear-gradient(135deg,#6C5CE7,#00B894,#FDCB6E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Battle</span>
            </h1>
          </div>
          <p style={{ fontSize: "1rem", color: "#a0a0b8", marginBottom: 24, animation: "fadeInUp .5s ease .2s backwards" }}>
            3 nhóm — 6 startup — Ai là nhà đầu tư giỏi nhất?
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 24, animation: "fadeInUp .5s ease .35s backwards" }}>
            {TEAMS.map((t, i) => (
              <div key={i} style={{
                padding: "16px 28px", borderRadius: 16,
                background: `rgba(${t.color === "#6C5CE7" ? "108,92,231" : t.color === "#00B894" ? "0,184,148" : "225,112,85"},.08)`,
                border: `2px solid ${t.color}44`,
                textAlign: "center",
                animation: `teamPop .4s cubic-bezier(.34,1.56,.64,1) ${.4 + i * .1}s backwards`,
              }}>
                <div style={{ fontSize: "2rem" }}>{t.emoji}</div>
                <div style={{ fontSize: ".9rem", fontWeight: 700, color: t.color, marginTop: 4 }}>{t.name}</div>
              </div>
            ))}
          </div>
          <div style={{
            padding: "16px 24px", borderRadius: 12,
            background: "rgba(253,203,110,.06)", border: "1px solid rgba(253,203,110,.15)",
            fontSize: ".85rem", color: "#aaa", marginBottom: 24, textAlign: "left",
            animation: "fadeInUp .5s ease .55s backwards",
          }}>
            <div style={{ fontWeight: 700, color: "#FDCB6E", marginBottom: 6 }}>📜 Luật chơi:</div>
            <div>• Mỗi round hiện 1 startup bí ẩn</div>
            <div>• 3 nhóm có <strong style={{ color: "#fff" }}>15 giây</strong> bàn bạc</div>
            <div>• Chọn: <strong style={{ color: "#00B894" }}>ĐẦU TƯ 💰</strong> hoặc <strong style={{ color: "#E17055" }}>TỪ CHỐI ❌</strong></div>
            <div>• Đầu tư đúng = <strong style={{ color: "#00B894" }}>+$100M</strong> | Bỏ lỡ unicorn = <strong style={{ color: "#E17055" }}>-$100M</strong></div>
            <div>• Đầu tư sai = <strong style={{ color: "#E17055" }}>-$50M</strong> | Từ chối đúng = <strong style={{ color: "#00B894" }}>+$30M</strong></div>
          </div>
          <button onClick={() => { setPhase("pitch"); }} style={{
            padding: "14px 40px", borderRadius: 50, border: "none",
            background: "linear-gradient(135deg,#6C5CE7,#00B894)",
            color: "#fff", fontSize: "1.1rem", fontWeight: 700, cursor: "pointer",
            boxShadow: "0 4px 20px rgba(108,92,231,.4)",
            transition: "all .3s",
            animation: "fadeInUp .5s ease .7s backwards",
          }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            🚀 Bắt đầu!
          </button>
        </div>
      )}

      {/* PITCH — show startup description */}
      {phase === "pitch" && (
        <div style={{ textAlign: "center", animation: "fxZoom .5s ease", maxWidth: 650, padding: 40, marginTop: 40 }}>
          <div style={{
            display: "inline-block", padding: "6px 16px", borderRadius: 50, marginBottom: 16,
            background: "rgba(253,203,110,.1)", border: "1px solid rgba(253,203,110,.2)",
            fontSize: ".8rem", fontWeight: 700, color: "#FDCB6E",
          }}>
            ROUND {round + 1} / {STARTUPS.length}
          </div>
          <div style={{ fontSize: "3rem", marginBottom: 12 }}>🎭</div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: 20 }}>Startup bí ẩn</h2>
          <div style={{
            padding: "24px", borderRadius: 16,
            background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)",
            marginBottom: 24, textAlign: "left",
          }}>
            <div style={{ fontSize: "1rem", lineHeight: 1.7, color: "#ccc", marginBottom: 12 }}>
              &quot;{startup.desc}&quot;
            </div>
            <div style={{ display: "flex", gap: 16, fontSize: ".82rem" }}>
              <span style={{ color: "#666" }}>📅 Năm: <strong style={{ color: "#FDCB6E" }}>{startup.year}</strong></span>
              <span style={{ color: "#666" }}>💰 Xin: <strong style={{ color: "#00B894" }}>{startup.ask}</strong></span>
            </div>
          </div>
          <p style={{ fontSize: ".9rem", color: "#888", marginBottom: 20 }}>
            Bạn có <strong style={{ color: "#fff" }}>15 giây</strong> để quyết định. Ready?
          </p>
          <button onClick={startCountdown} style={{
            padding: "12px 36px", borderRadius: 50, border: "none",
            background: "linear-gradient(135deg,#FDCB6E,#E17055)",
            color: "#fff", fontSize: "1rem", fontWeight: 700, cursor: "pointer",
            boxShadow: "0 4px 20px rgba(253,203,110,.3)",
          }}>
            ⏱️ Bắt đầu đếm ngược!
          </button>
        </div>
      )}

      {/* COUNTDOWN */}
      {phase === "countdown" && (
        <div style={{ textAlign: "center", maxWidth: 650, padding: 40, marginTop: 40 }}>
          <div style={{
            display: "inline-block", padding: "6px 16px", borderRadius: 50, marginBottom: 16,
            background: "rgba(253,203,110,.1)", border: "1px solid rgba(253,203,110,.2)",
            fontSize: ".8rem", fontWeight: 700, color: "#FDCB6E",
          }}>
            ROUND {round + 1} — BÀN BẠC!
          </div>
          <div style={{
            padding: "20px", borderRadius: 16,
            background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)",
            marginBottom: 20, fontSize: ".9rem", color: "#aaa", textAlign: "left",
          }}>
            &quot;{startup.desc}&quot;
          </div>
          <div style={{
            fontSize: timer <= 5 ? "6rem" : "5rem",
            fontWeight: 900,
            color: timer <= 3 ? "#E17055" : timer <= 5 ? "#FDCB6E" : "#00B894",
            transition: "all .3s",
            animation: timer <= 5 ? "pulse .5s infinite" : "none",
            marginBottom: 16,
          }}>
            {timer}
          </div>
          <p style={{ fontSize: "1rem", color: "#888" }}>
            {timer > 5 ? "🤔 Bàn bạc nhóm..." : timer > 0 ? "⚡ Sắp hết giờ!" : "⏰ Hết giờ!"}
          </p>
        </div>
      )}

      {/* VOTE — presenter records each team's choice */}
      {phase === "vote" && !revealed && (
        <div style={{ textAlign: "center", animation: "fxBounce .5s ease", maxWidth: 700, padding: 40, marginTop: 40 }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 20 }}>🗳️ Ghi nhận câu trả lời!</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {TEAMS.map((team, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "14px 20px",
                borderRadius: 14,
                background: votes[i] !== null
                  ? votes[i] ? "rgba(0,184,148,.08)" : "rgba(225,112,85,.08)"
                  : "rgba(255,255,255,.03)",
                border: `1px solid ${votes[i] !== null
                  ? votes[i] ? "rgba(0,184,148,.3)" : "rgba(225,112,85,.3)"
                  : "rgba(255,255,255,.08)"}`,
                transition: "all .3s",
              }}>
                <span style={{ fontSize: "1.3rem" }}>{team.emoji}</span>
                <span style={{ fontSize: ".9rem", fontWeight: 700, color: team.color, flex: 1, textAlign: "left" }}>{team.name}</span>
                <button onClick={() => handleVote(i, true)} style={{
                  padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer",
                  background: votes[i] === true ? "#00B894" : "rgba(0,184,148,.15)",
                  color: votes[i] === true ? "#fff" : "#00B894",
                  fontWeight: 700, fontSize: ".82rem", transition: "all .2s",
                }}>💰 Đầu tư</button>
                <button onClick={() => handleVote(i, false)} style={{
                  padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer",
                  background: votes[i] === false ? "#E17055" : "rgba(225,112,85,.15)",
                  color: votes[i] === false ? "#fff" : "#E17055",
                  fontWeight: 700, fontSize: ".82rem", transition: "all .2s",
                }}>❌ Từ chối</button>
              </div>
            ))}
          </div>
          {allVoted && (
            <button onClick={doReveal} style={{
              marginTop: 24, padding: "14px 40px", borderRadius: 50, border: "none",
              background: "linear-gradient(135deg,#FDCB6E,#E17055)",
              color: "#fff", fontSize: "1.1rem", fontWeight: 700, cursor: "pointer",
              boxShadow: "0 4px 20px rgba(253,203,110,.4)",
              animation: "pulse 1s infinite",
            }}>
              🎭 REVEAL!
            </button>
          )}
        </div>
      )}

      {/* REVEAL */}
      {phase === "reveal" && (
        <div style={{ textAlign: "center", animation: "fxFlip .6s ease", maxWidth: 700, padding: 40, marginTop: 40 }}>
          <div style={{ fontSize: "3.5rem", marginBottom: 8 }}>{startup.emoji}</div>
          <div style={{
            display: "inline-block", padding: "6px 20px", borderRadius: 50, marginBottom: 12,
            background: startup.success ? "rgba(0,184,148,.15)" : "rgba(225,112,85,.15)",
            border: `1px solid ${startup.success ? "rgba(0,184,148,.3)" : "rgba(225,112,85,.3)"}`,
            fontSize: ".85rem", fontWeight: 700,
            color: startup.success ? "#00B894" : "#E17055",
          }}>
            {startup.success ? "✅ THÀNH CÔNG" : "❌ THẤT BẠI"}
          </div>
          <h2 style={{ fontSize: "2rem", fontWeight: 900, marginBottom: 6 }}>{startup.name}</h2>
          <p style={{ fontSize: "1rem", color: "#FDCB6E", fontWeight: 700, marginBottom: 16 }}>{startup.result}</p>
          <div style={{
            padding: "12px 18px", borderRadius: 10,
            background: "rgba(108,92,231,.06)", border: "1px solid rgba(108,92,231,.15)",
            fontSize: ".85rem", color: "#aaa", marginBottom: 20,
          }}>
            💡 <strong style={{ color: "#fff" }}>Bài học:</strong> {startup.lesson}
          </div>
          {/* Team results */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 20 }}>
            {TEAMS.map((team, i) => {
              const invested = votes[i];
              const correct = (invested && startup.success) || (!invested && !startup.success);
              const pts = invested
                ? startup.success ? +100 : -50
                : startup.success ? -100 : +30;
              return (
                <div key={i} style={{
                  padding: "12px 18px", borderRadius: 12,
                  background: correct ? "rgba(0,184,148,.06)" : "rgba(225,112,85,.06)",
                  border: `1px solid ${correct ? "rgba(0,184,148,.2)" : "rgba(225,112,85,.2)"}`,
                  textAlign: "center", minWidth: 130,
                }}>
                  <div style={{ fontSize: "1.2rem" }}>{team.emoji}</div>
                  <div style={{ fontSize: ".8rem", fontWeight: 700, color: team.color }}>{team.name}</div>
                  <div style={{ fontSize: ".75rem", color: "#888", marginTop: 4 }}>
                    {invested ? "💰 Đầu tư" : "❌ Từ chối"}
                  </div>
                  <div style={{
                    fontSize: "1.2rem", fontWeight: 900, marginTop: 4,
                    color: pts > 0 ? "#00B894" : "#E17055",
                  }}>
                    {pts > 0 ? "+" : ""}{pts}M
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={nextRound} style={{
            padding: "12px 36px", borderRadius: 50, border: "none",
            background: round < STARTUPS.length - 1
              ? "linear-gradient(135deg,#6C5CE7,#00B894)"
              : "linear-gradient(135deg,#FDCB6E,#E17055)",
            color: "#fff", fontSize: "1rem", fontWeight: 700, cursor: "pointer",
          }}>
            {round < STARTUPS.length - 1 ? `➡️ Round ${round + 2}` : "🏆 Xem kết quả!"}
          </button>
        </div>
      )}

      {/* FINAL */}
      {phase === "final" && (
        <div style={{ textAlign: "center", animation: "fxZoom .6s ease", maxWidth: 700, padding: 40 }}>
          <div style={{ fontSize: "4rem", marginBottom: 8 }}>🏆</div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, marginBottom: 6, fontFamily: "'Playfair Display', serif" }}>
            Kết quả!
          </h1>
          <p style={{ fontSize: "1rem", color: "#888", marginBottom: 28 }}>Nhà đầu tư giỏi nhất là...</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", alignItems: "flex-end", marginBottom: 28 }}>
            {/* Sort by score for podium */}
            {[...TEAMS.map((t, i) => ({ ...t, score: scores[i], idx: i }))]
              .sort((a, b) => b.score - a.score)
              .map((team, rank) => (
                <div key={team.idx} style={{
                  padding: "20px 24px", borderRadius: 16,
                  background: rank === 0
                    ? "linear-gradient(145deg, rgba(253,203,110,.12), rgba(253,203,110,.04))"
                    : "rgba(255,255,255,.03)",
                  border: rank === 0
                    ? "2px solid rgba(253,203,110,.4)"
                    : "1px solid rgba(255,255,255,.08)",
                  textAlign: "center", flex: 1,
                  transform: rank === 0 ? "scale(1.1)" : "scale(1)",
                  boxShadow: rank === 0 ? "0 8px 30px rgba(253,203,110,.2)" : "none",
                  order: rank === 0 ? 1 : rank === 1 ? 0 : 2,
                }}>
                  <div style={{ fontSize: rank === 0 ? "2rem" : "1.5rem" }}>
                    {rank === 0 ? "👑" : rank === 1 ? "🥈" : "🥉"}
                  </div>
                  <div style={{ fontSize: "2rem", marginTop: 4 }}>{team.emoji}</div>
                  <div style={{ fontSize: ".9rem", fontWeight: 700, color: team.color, marginTop: 4 }}>{team.name}</div>
                  <div style={{
                    fontSize: rank === 0 ? "1.8rem" : "1.3rem",
                    fontWeight: 900, marginTop: 6,
                    color: team.score >= 0 ? "#00B894" : "#E17055",
                  }}>
                    ${team.score}M
                  </div>
                </div>
              ))}
          </div>
          <div style={{
            padding: "14px 20px", borderRadius: 12,
            background: "rgba(108,92,231,.06)", border: "1px solid rgba(108,92,231,.15)",
            fontSize: ".9rem", color: "#aaa",
          }}>
            🎉 Chúc mừng <strong style={{ color: TEAMS[winnerIdx].color }}>{TEAMS[winnerIdx].name}</strong> — Nhà đầu tư sáng suốt nhất!
          </div>
          <button onClick={() => { window.location.href = "/"; }} style={{
            marginTop: 20, padding: "10px 28px", borderRadius: 50, border: "1px solid rgba(255,255,255,.1)",
            background: "rgba(255,255,255,.04)", color: "#aaa", fontSize: ".85rem",
            cursor: "pointer",
          }}>
            ← Về bài thuyết trình
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes fxZoom { from { opacity: 0; transform: scale(.7); } to { opacity: 1; transform: scale(1); } }
        @keyframes fxBounce { from { opacity: 0; transform: scale(.8) translateY(30px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes fxFlip { from { opacity: 0; transform: perspective(1000px) rotateY(-20deg); } to { opacity: 1; transform: perspective(1000px) rotateY(0); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes floatShape { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(30px, -20px); } }
        @keyframes sharkDrop { from { opacity: 0; transform: scale(3) translateY(-60px); filter: blur(8px); } to { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); } }
        @keyframes sharkPulse { 0%, 100% { transform: scale(1) translateY(0); } 50% { transform: scale(1.08) translateY(-6px); } }
        @keyframes titleSlam { from { opacity: 0; transform: scale(2.5) translateY(30px); filter: blur(10px); } to { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shrinkTitle { from { opacity: 0; transform: scale(1.6); } to { opacity: 1; transform: scale(1); } }
        @keyframes teamPop { from { opacity: 0; transform: scale(.5); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}
