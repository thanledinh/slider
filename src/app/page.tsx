"use client";
import { useState, useEffect, useCallback } from "react";

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [showBuffer, setShowBuffer] = useState(false);
  const [showZappos, setShowZappos] = useState(false);
  const [showDropbox, setShowDropbox] = useState(false);
  const [showEquity, setShowEquity] = useState(false);
  const totalSlides = 23;

  const goTo = useCallback(
    (n: number) => {
      if (n < 0 || n >= totalSlides || n === current) return;
      const slides = document.querySelectorAll(".slide");
      const dir = n > current ? 1 : -1;
      const prev = slides[current];
      const next = slides[n];
      if (!prev || !next) return;

      prev.classList.remove("active");
      prev.classList.add(dir === 1 ? "exit-left" : "exit-right");

      next.classList.remove("exit-left", "exit-right", "enter-left", "enter-right");
      next.classList.add(dir === 1 ? "enter-right" : "enter-left");
      void (next as HTMLElement).offsetWidth;
      next.classList.remove("enter-left", "enter-right");
      next.classList.add("active");

      setTimeout(() => {
        prev.classList.remove("exit-left", "exit-right");
      }, 600);

      setCurrent(n);
    },
    [current, totalSlides]
  );

  const nextSlide = useCallback(() => goTo(current + 1), [current, goTo]);
  const prevSlide = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") nextSlide();
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") prevSlide();
      else if (e.key === "Home") goTo(0);
      else if (e.key === "End") goTo(totalSlides - 1);
    };
    let startX = 0;
    const handleTouchStart = (e: TouchEvent) => { startX = e.touches[0].clientX; };
    const handleTouchEnd = (e: TouchEvent) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
    };
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 30) e.deltaY > 0 ? nextSlide() : prevSlide();
    };

    window.addEventListener("keydown", handleKey);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [nextSlide, prevSlide, goTo, totalSlides]);

  // Accordion toggle
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const header = (e.target as HTMLElement).closest(".accordion-header");
      if (!header) return;
      const item = header.parentElement;
      if (!item) return;
      const body = item.querySelector(".accordion-body") as HTMLElement;
      if (!body) return;
      const isOpen = item.classList.contains("open");
      if (isOpen) {
        body.style.maxHeight = "0";
        item.classList.remove("open");
        const icon = header.querySelector(".accordion-icon");
        if (icon) icon.textContent = "+";
      } else {
        body.style.maxHeight = body.scrollHeight + "px";
        item.classList.add("open");
        const icon = header.querySelector(".accordion-icon");
        if (icon) icon.textContent = "−";
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const progress = ((current + 1) / totalSlides) * 100;

  return (
    <>
      <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
      <div className="slide-counter">{current + 1} / {totalSlides}</div>
      <button className="nav-arrow nav-prev" onClick={prevSlide}><i className="fas fa-chevron-left" /></button>
      <button className="nav-arrow nav-next" onClick={nextSlide}><i className="fas fa-chevron-right" /></button>

      <div className="slides-container">
        {/* 1: TITLE */}
        <div className={`slide slide-title ${current === 0 ? "active" : ""}`}>
          <div className="floating-shapes"><div className="shape shape-1" /><div className="shape shape-2" /><div className="shape shape-3" /><div className="shape shape-4" /></div>
          <div className="slide-content">
            <div className="badge">NHÓM 2 • MODULE 1</div>
            <h1 className="title-main">Intro to<br /><span className="gradient-text">Entrepreneurship</span></h1>
            <p className="title-subtitle">Get Started as an Entrepreneur</p>
            <div className="title-sections">
              <div className="section-pill"><i className="fas fa-cube" /> Core Concepts</div>
              <div className="section-pill"><i className="fas fa-check-circle" /> Validation</div>
              <div className="section-pill"><i className="fas fa-coins" /> Fundraising</div>
              <div className="section-pill"><i className="fas fa-lightbulb" /> Idea Generation</div>
            </div>
            <div className="title-members"><p>Buổi Meet 2 • Udemy Course</p></div>
          </div>
        </div>

        {/* 2: AGENDA */}
        <Slide i={1} c={current}>
          <div className="section-label">NỘI DUNG TRÌNH BÀY</div>
          <h2>Agenda</h2>
          <div className="agenda-grid">
            <div className="agenda-card" style={{"--accent":"#6C5CE7"} as React.CSSProperties}><div className="agenda-number">01</div><div className="agenda-icon"><i className="fas fa-cube" /></div><h3>Core Concepts &amp; Framework</h3><p>Service vs Product, Business Models, Scalability</p></div>
            <div className="agenda-card" style={{"--accent":"#00B894"} as React.CSSProperties}><div className="agenda-number">02</div><div className="agenda-icon"><i className="fas fa-check-circle" /></div><h3>Validating Your Idea</h3><p>Surveys, Experts, Lean Startup, MVP, Pitch Experiments</p></div>
            <div className="agenda-card" style={{"--accent":"#FDCB6E"} as React.CSSProperties}><div className="agenda-number">03</div><div className="agenda-icon"><i className="fas fa-coins" /></div><h3>Fundraising</h3><p>Bootstrapping, FFF, Angels, VC, Incubators, Loans</p></div>
            <div className="agenda-card" style={{"--accent":"#E17055"} as React.CSSProperties}><div className="agenda-number">04</div><div className="agenda-icon"><i className="fas fa-lightbulb" /></div><h3>Idea Generation</h3><p>Scratchpad, Idea Lister Builder, Equation of Ideas</p></div>
          </div>
        </Slide>

        {/* 3: SECTION 5 COVER */}
        <div className={`slide slide-section-cover ${current === 2 ? "active" : ""}`} style={{"--section-color":"#6C5CE7"} as React.CSSProperties}>
          <div className="section-bg-number">05</div>
          <img src="/img/business_models.png" className="section-cover-img" alt="" />
          <div className="slide-content">
            <div className="section-label">SECTION 5</div>
            <h1>Core Concepts<br />&amp; Framework</h1>
            <p className="section-desc">Các khái niệm cốt lõi và khung tư duy khởi nghiệp</p>
          </div>
        </div>

        {/* 4: Service vs Product */}
        <Slide i={3} c={current} label="SECTION 5 • CORE CONCEPTS" color="#6C5CE7">
          <h2>Service vs. Product Businesses</h2>
          <TwoCol
            left={<><div className="col-icon" style={{background:"linear-gradient(135deg,#6C5CE7,#a29bfe)"}}><i className="fas fa-box" /></div><h3>Product Business</h3><ul><li>Bạn <strong>bán một sản phẩm</strong></li><li>VD: Apple bán iPhone</li><li><strong>Dễ mở rộng</strong> (scale)</li></ul></>}
            right={<><div className="col-icon" style={{background:"linear-gradient(135deg,#00B894,#55efc4)"}}><i className="fas fa-hands-helping" /></div><h3>Service Business</h3><ul><li>Bạn <strong>thực hiện công việc</strong></li><li>VD: Sửa chữa iPhone</li><li><strong>Khó scale</strong> — cần thêm nhân sự</li></ul></>}
          />
          <Accordion title="🔍 Ví dụ: SaaS — Phần mềm chuyển từ Product → Service">
            <div className="example-highlight"><strong>Microsoft Office:</strong> Trước đây bán đĩa CD ~$300/lần → Nay chuyển sang <strong>Microsoft 365</strong> thu phí $9.99/tháng. Kết quả: doanh thu ổn định, khách hàng gắn bó lâu hơn.</div>
            <div className="example-highlight"><strong>Adobe:</strong> Photoshop từng bán $999/phiên bản → Nay <strong>Adobe Creative Cloud</strong> $54.99/tháng. Doanh thu tăng 5x trong 8 năm.</div>
            <p>💡 <strong>Tại sao SaaS thắng?</strong> Thu phí hàng tháng = doanh thu lặp lại (recurring revenue), dự đoán được, dễ scale vì chi phí biên gần = 0.</p>
          </Accordion>
        </Slide>

        {/* 5: Business Models */}
        <Slide i={4} c={current} label="SECTION 5 • CORE CONCEPTS" color="#6C5CE7">
          <h2>Business Models</h2>
          <p className="slide-desc">Cách bạn kiếm tiền từ sản phẩm/dịch vụ</p>
          <div className="models-grid">
            <ModelCard tag="Old" icon="fa-store" name="Retail" desc={`"Brick & mortar" → "Brick & click"`} />
            <ModelCard tag="Old" icon="fa-utensils" name="Franchise" desc="McDonald's, Subway" />
            <ModelCard tag="New" isNew icon="fa-mobile-alt" name="On Demand" desc="Uber, Lyft, Postmates" />
            <ModelCard tag="New" isNew icon="fa-share-alt" name="Sharing Economy" desc="Airbnb, Getaround" />
            <ModelCard tag="New" isNew icon="fa-users" name="Crowdsourcing" desc="Teespring" />
            <ModelCard tag="New" isNew icon="fa-gift" name="Freemium" desc="Evernote" />
            <ModelCard tag="New" isNew icon="fa-truck" name="Direct to Consumer" desc="Dell, Warby Parker" />
          </div>
          <Accordion title="🔍 Sharing Economy & On Demand — Giải thích chi tiết">
            <p>💡 <strong>Sharing Economy là gì?</strong> Mô hình kinh doanh dựa trên việc <strong>CHIA SẺ tài nguyên nhàn rỗi</strong> thay vì mua mới. Nền tảng kết nối người CÓ với người CẦN, thu phí trung gian ~15-25%.</p>
            <div className="example-highlight"><strong>🔧 Power Drill Dilemma:</strong><br/>Khoan điện giá $100 nhưng dùng 13 phút cả đời. Bạn không cần cái khoan — bạn cần CÁI LỖ TRÊN TƯỜNG. Thuê $5/lần, tiết kiệm $95.</div>
            <div className="example-highlight"><strong>🏠 Airbnb — Từ nệm hơi đến $75 tỷ:</strong><br/>2007: 2 founder không đủ tiền nhà → cho thuê nệm hơi $80/đêm. Tự bay đến NY chụp ảnh đẹp miễn phí cho chủ nhà. COVID mất 80% booking nhưng phục hồi nhờ &quot;work from anywhere&quot;. Nay: 7 triệu nhà, 220 quốc gia.</div>
            <div className="example-highlight"><strong>🚗 Grab — On Demand Đông Nam Á:</strong><br/>2012: Anthony Tan thấy taxi Malaysia tệ → tạo app. GrabBike VN, tuk-tuk Thái → GrabFood (tận dụng tài xế rảnh) → GrabPay (70% dân unbanked). Mua Uber SEA 2018. Lỗ $10 tỷ trước IPO nhưng thành super app <strong>$40 tỷ</strong>.</div>
          </Accordion>
        </Slide>

        {/* 6: Scalability */}
        <Slide i={5} c={current} label="SECTION 5 • CORE CONCEPTS" color="#6C5CE7">
          <h2>Scalability — Khả năng mở rộng</h2>
          <div className="scale-levels">
            <div className="scale-item"><div className="scale-bar" style={{width:"30%",background:"#e17055"}} /><div className="scale-info"><h4>Side Business</h4><p>Ít quan tâm scalability</p></div></div>
            <div className="scale-item"><div className="scale-bar" style={{width:"60%",background:"#FDCB6E"}} /><div className="scale-info"><h4>Lifestyle Business</h4><p>Trung bình</p></div></div>
            <div className="scale-item"><div className="scale-bar" style={{width:"95%",background:"#00B894"}} /><div className="scale-info"><h4>Startup</h4><p>Rất cần — yếu tố sống còn</p></div></div>
          </div>
          <Accordion title="🔍 Ví dụ: Marginal Cost — Dễ scale vs Khó scale">
            <div className="example-highlight">🎨 <strong>Bán tranh vẽ tay:</strong> Mỗi bức mất 20h vẽ. Marginal cost = rất cao → khó scale.</div>
            <div className="example-highlight">💊 <strong>Thuốc cho bệnh hiếm:</strong> Thị trường giới hạn. Scale bị giới hạn bởi nhu cầu.</div>
            <div className="example-highlight">🎓 <strong>Online course (Udemy):</strong> Làm 1 lần, bán 1 triệu lần. Marginal cost ≈ 0. <strong>Rất dễ scale!</strong></div>
            <p>💡 <strong>Quy tắc:</strong> &quot;Marginal cost bao nhiêu?&quot; = Chi phí làm thêm 1 sản phẩm. Càng thấp → càng dễ scale.</p>
          </Accordion>
        </Slide>

        {/* 7: SECTION 6 COVER */}
        <SectionCover i={6} c={current} color="#00B894" num="06" img="/img/lean_startup.png" title={<>Validating<br/>Your Idea</>} desc="Kiểm chứng ý tưởng trước khi đầu tư thời gian và tiền bạc" />

        {/* 8: What is Validation */}
        <Slide i={7} c={current} label="SECTION 6 • VALIDATING YOUR IDEA" color="#00B894">
          <h2>What is Validation?</h2>
          <div className="highlight-quote">
            <i className="fas fa-quote-left" />
            <p>&quot;When we&apos;re in the shower and we have an idea, boy, does it sound great. But in reality, most of our ideas are actually quite terrible.&quot;</p>
            <span className="quote-author">— Eric Ries</span>
          </div>
          <div className="stats-row">
            <div className="stat-card"><div className="stat-number" style={{color:"#e17055"}}>90%</div><p>Startup thất bại</p></div>
            <div className="stat-card"><div className="stat-number" style={{color:"#FDCB6E"}}>42%</div><p>Vì không có nhu cầu thị trường</p></div>
            <div className="stat-card"><div className="stat-number" style={{color:"#00B894"}}>10x</div><p>Tiết kiệm khi validate sớm</p></div>
          </div>
        </Slide>

        {/* 9: Surveys */}
        <Slide i={8} c={current} label="SECTION 6 • VALIDATING YOUR IDEA" color="#00B894">
          <h2>Surveys &amp; Talking to Experts</h2>
          <TwoCol
            left={<><div className="col-icon" style={{background:"linear-gradient(135deg,#00B894,#55efc4)"}}><i className="fas fa-poll" /></div><h3>Surveys</h3><ul><li><strong>&quot;Wisdom of crowds&quot;</strong></li><li>Hỏi: người trong ngành + khách hàng</li><li>Hãy <strong>khách quan</strong> — tránh false positive</li><li>Tools: Google Forms, Reddit, Facebook</li></ul></>}
            right={<><div className="col-icon" style={{background:"linear-gradient(135deg,#6C5CE7,#a29bfe)"}}><i className="fas fa-user-tie" /></div><h3>Talking to Experts</h3><ul><li>Có <strong>thông tin nội bộ</strong> &amp; bí mật ngành</li><li>Tìm trên: LinkedIn, blogs chuyên ngành</li><li>Liên hệ <strong>càng nhiều càng tốt</strong></li></ul></>}
          />
          <Accordion title="🔍 Cách hỏi khách hàng & chuyên gia đúng cách">
            <div className="example-highlight"><strong>Hỏi khách hàng:</strong> &quot;Bạn có gặp vấn đề X không?&quot;, &quot;Đã dùng giải pháp nào?&quot;, &quot;Sẵn sàng trả bao nhiêu?&quot;</div>
            <div className="example-highlight"><strong>Hỏi chuyên gia:</strong> &quot;Vấn đề này có thực sự tồn tại?&quot;, &quot;Người ta có trả tiền cho giải pháp không?&quot;</div>
            <p>⚠️ <strong>Sai lầm phổ biến:</strong> Nói &quot;Ý tưởng em hay lắm đúng không?&quot; → Người ta sẽ đồng ý vì lễ phép.</p>
          </Accordion>
        </Slide>

        {/* 10: Lean Startup */}
        <Slide i={9} c={current} label="SECTION 6 • VALIDATING YOUR IDEA" color="#00B894">
          <h2>The Lean Startup Framework</h2>
          <p className="slide-desc">Eric Ries — Mọi ý tưởng đều dựa trên giả định, cần kiểm chứng</p>
          <div className="cycle-container">
            <div className="cycle-item cycle-build"><div className="cycle-icon"><i className="fas fa-hammer" /></div><h3>BUILD</h3><p>Xây MVP — sản phẩm tối giản</p></div>
            <div className="cycle-arrow"><i className="fas fa-arrow-right" /></div>
            <div className="cycle-item cycle-measure"><div className="cycle-icon"><i className="fas fa-chart-bar" /></div><h3>MEASURE</h3><p>Đo phản hồi khách hàng thực</p></div>
            <div className="cycle-arrow"><i className="fas fa-arrow-right" /></div>
            <div className="cycle-item cycle-learn"><div className="cycle-icon"><i className="fas fa-brain" /></div><h3>LEARN</h3><p>Rút bài học, pivot hoặc tiếp tục</p></div>
          </div>
          <div className="concepts-row">
            <div className="concept-chip"><strong>Hypothesis</strong> — Giả định cần kiểm chứng</div>
            <div className="concept-chip"><strong>Validated Learning</strong> — Học từ thử nghiệm thực tế</div>
            <div className="concept-chip"><strong>Pivot</strong> — Đổi hướng lớn</div>
            <div className="concept-chip"><strong>Min. Criteria</strong> — Mức tối thiểu để coi là validate</div>
          </div>
        </Slide>

        {/* 11: Pitch & MVP */}
        <Slide i={10} c={current} label="SECTION 6 • VALIDATING YOUR IDEA" color="#00B894">
          <h2>Pitch Experiments &amp; MVP</h2>
          <TwoCol
            left={<><div className="col-icon" style={{background:"linear-gradient(135deg,#FDCB6E,#ffeaa7)"}}><i className="fas fa-bullhorn" /></div><h3>Pitch Experiments</h3><ul><li><strong>Giả vờ sản phẩm đã có</strong> → pitch cho khách</li><li>Tạo landing page → đo sign-ups / clicks &quot;Buy&quot;</li><li>Dùng free ad coupons từ Facebook, Google</li></ul></>}
            right={<><div className="col-icon" style={{background:"linear-gradient(135deg,#E17055,#fab1a0)"}}><i className="fas fa-rocket" /></div><h3>MVP — Minimum Viable Product</h3><ul><li>95% entrepreneurs dùng phương pháp này</li><li><strong>Nỗ lực tối thiểu</strong> để xác định KH muốn mua</li><li>Nếu không ai trả tiền → ý tưởng không ổn</li></ul></>}
          />
          <Accordion title="🔍 Ví dụ MVP nổi tiếng: Zappos, Dropbox, Buffer">
            <div className="example-highlight" style={{cursor:"pointer",transition:"all .2s"}} onClick={(e)=>{e.stopPropagation();setShowZappos(true)}}>
              👟 <strong style={{color:"#FDCB6E",textDecoration:"underline",textDecorationStyle:"dotted"}}>👆 Zappos (BẤM ĐỂ XEM DEMO):</strong> Chụp ảnh giày từ cửa hàng, đăng lên web. Khi có đơn → đi mua rồi ship. Chứng minh: người ta muốn mua giày online! → Bán cho Amazon <strong>$1.2 tỷ</strong>.
            </div>
            <div className="example-highlight" style={{cursor:"pointer",transition:"all .2s"}} onClick={(e)=>{e.stopPropagation();setShowDropbox(true)}}>
              📦 <strong style={{color:"#FDCB6E",textDecoration:"underline",textDecorationStyle:"dotted"}}>👆 Dropbox (BẤM ĐỂ XEM DEMO):</strong> Làm video demo 3 phút giả vờ sản phẩm đã xong. Đăng ký tăng từ 5,000 → <strong>75,000 người qua đêm</strong>.
            </div>
            <div className="example-highlight" style={{cursor:"pointer",transition:"all .2s"}} onClick={(e)=>{e.stopPropagation();setShowBuffer(true)}}>
              📱 <strong style={{color:"#FDCB6E",textDecoration:"underline",textDecorationStyle:"dotted"}}>👆 Buffer (BẤM ĐỂ XEM DEMO):</strong> Tạo landing page &quot;đang xây dựng&quot; + nút pricing → nếu click = có nhu cầu. Thu hút đủ sign-ups trước khi viết dòng code nào.
            </div>
          </Accordion>
        </Slide>

        {/* 12: SECTION 7 COVER */}
        <SectionCover i={11} c={current} color="#FDCB6E" num="07" img="/img/fundraising.png" title="Fundraising" desc="Chiến lược gọi vốn và tài trợ cho startup" />

        {/* 13: Bootstrapping & FFF */}
        <Slide i={12} c={current} label="SECTION 7 • FUNDRAISING" color="#FDCB6E">
          <h2>Bootstrapping &amp; FFF</h2>
          <TwoCol
            left={<><div className="col-icon" style={{background:"linear-gradient(135deg,#FDCB6E,#ffeaa7)"}}><i className="fas fa-piggy-bank" /></div><h3>Bootstrapping</h3><ul><li>Tự tài trợ từ <strong>tiền cá nhân</strong></li><li>Dùng doanh thu sớm tái đầu tư</li><li>Giữ 100% quyền kiểm soát</li></ul></>}
            right={<><div className="col-icon" style={{background:"linear-gradient(135deg,#E17055,#fab1a0)"}}><i className="fas fa-heart" /></div><h3>FFF — Friends, Family &amp; Fools</h3><ul><li>Nguồn vốn <strong>dễ tiếp cận nhất</strong></li><li>Đầu tư dựa trên <strong>niềm tin cá nhân</strong></li><li>Rủi ro: ảnh hưởng mối quan hệ</li></ul></>}
          />
          <Accordion title="🔍 Ví dụ: Bootstrapping & FFF thành công">
            <div className="example-highlight">📧 <strong>Mailchimp (Bootstrap):</strong> Bootstrap từ 2001, không nhận vốn ngoài. Năm 2021 bán cho Intuit với giá <strong>$12 tỷ</strong>. Founders giữ 100% → nhận trọn $12 tỷ!</div>
            <div className="example-highlight">🎮 <strong>Mojang — Minecraft (Bootstrap):</strong> Notch tự code Minecraft một mình, bán game online. Microsoft mua lại <strong>$2.5 tỷ</strong> năm 2014.</div>
            <div className="example-highlight">📦 <strong>Amazon (FFF):</strong> Jeff Bezos vay <strong>$245,000</strong> từ bố mẹ để khởi nghiệp Amazon năm 1994. Bố mẹ nói: &quot;Chúng tôi không đầu tư vào Amazon, chúng tôi đầu tư vào Jeff.&quot; → Giờ Amazon trị giá <strong>$1.7 nghìn tỷ</strong>. Bố mẹ lời khoảng <strong>$30 tỷ</strong>!</div>
            <div className="example-highlight">🔍 <strong>Google (FFF):</strong> Larry Page &amp; Sergey Brin nhận <strong>$100,000</strong> từ Andy Bechtolsheim (đồng sáng lập Sun Microsystems) — viết check trước cả khi Google thành lập công ty! Đó chính là &quot;Fool&quot; — tin tưởng tuyệt đối vào con người.</div>
            <p>⚠️ <strong>Lưu ý FFF:</strong> Nếu startup thất bại → mất tiền LẪN mối quan hệ. Luôn nói rõ rủi ro trước khi nhận tiền từ người thân!</p>
          </Accordion>
        </Slide>

        {/* 14: Angels */}
        <Slide i={13} c={current} label="SECTION 7 • FUNDRAISING" color="#FDCB6E">
          <h2>Angel Investors &amp; Equity vs Debt</h2>
          <TwoCol
            left={<><div className="col-icon" style={{background:"linear-gradient(135deg,#6C5CE7,#a29bfe)"}}><i className="fas fa-user-astronaut" /></div><h3>Angel Investors</h3><ul><li>Tìm: <strong>AngelList, Wefunding, FundersClub</strong></li><li>Angel groups &amp; syndicates</li><li>Ưu tiên angels đầu tư thường xuyên</li></ul></>}
            right={<><div className="col-icon" style={{background:"linear-gradient(135deg,#00B894,#55efc4)"}}><i className="fas fa-balance-scale" /></div><h3>Equity vs Debt</h3><ul><li><strong>Equity</strong> = sở hữu cổ phần. Không cần trả nếu thất bại</li><li><strong>Debt</strong> = vay nợ. Phải trả dù thất bại!</li><li><strong>Dividends</strong> = chia lợi nhuận theo % sở hữu</li></ul></>}
          />
          <Accordion title="🔍 Equity vs Debt — So sánh trực quan">
            <div className="example-highlight" style={{cursor:"pointer",transition:"all .2s"}} onClick={(e)=>{e.stopPropagation();setShowEquity(true)}}>
              ⚖️ <strong style={{color:"#FDCB6E",textDecoration:"underline",textDecorationStyle:"dotted"}}>👆 BẤM ĐỂ XEM DEMO:</strong> Xem ngay kịch bản đầu tư $100K — chuyện gì xảy ra khi startup THÀNH CÔNG vs THẤT BẠI?
            </div>
          </Accordion>
        </Slide>

        {/* 15: VC & Loans */}
        <Slide i={14} c={current} label="SECTION 7 • FUNDRAISING" color="#FDCB6E">
          <h2>Venture Capital &amp; Loans</h2>
          <TwoCol
            left={<><div className="col-icon" style={{background:"linear-gradient(135deg,#6C5CE7,#a29bfe)"}}><i className="fas fa-building" /></div><h3>Venture Capital</h3><ul><li>Quỹ đầu tư tiền người khác — hứa trả trong <strong>7 năm</strong></li><li>~90% tiền VC ở <strong>Silicon Valley</strong></li><li>9/10 khoản đầu tư thất bại</li></ul></>}
            right={<><div className="col-icon" style={{background:"linear-gradient(135deg,#FDCB6E,#ffeaa7)"}}><i className="fas fa-university" /></div><h3>Loans</h3><ul><li>$10,000 - $300,000+</li><li><strong>Pros:</strong> Rẻ nhất, phạm vi rộng</li><li><strong>Cons:</strong> Cần cash flow + assets, 2 năm lịch sử</li></ul></>}
          />
          <Accordion title="🔍 Ví dụ: Cách tiếp cận VC — Referral là key!">
            <div className="example-highlight"><strong>Cách 1 — Referral:</strong> Nhờ bạn bè, founder khác giới thiệu. VC nhận hàng ngàn pitch mỗi năm, referral giúp bạn nổi bật.</div>
            <div className="example-highlight"><strong>Cách 2 — Events:</strong> Meetups, business plan competitions, conferences.</div>
            <div className="example-highlight"><strong>Cách 3 — Incubators:</strong> Vào được YC/Techstars = tự động có access VC network.</div>
            <p>⚠️ <strong>Lưu ý:</strong> VC chỉ chọn startup có tiềm năng &quot;lớn gấp 100x&quot; → nếu không, VC không phù hợp.</p>
          </Accordion>
        </Slide>

        {/* 16: Incubators */}
        <Slide i={15} c={current} label="SECTION 7 • FUNDRAISING" color="#FDCB6E">
          <h2>Incubators — Vườn ươm khởi nghiệp</h2>
          <div className="incubator-info">
            <div className="incubator-main"><ul><li>Đổi <strong>5-7% equity</strong> → nhận <strong>$15,000 - $25,000</strong></li><li>Mentorship, networking, pháp lý miễn phí</li><li>~400 incubators tại Mỹ, chương trình ~3 tháng</li><li>Có thể <strong>nộp đi nộp lại</strong> đến khi được chấp nhận</li></ul></div>
            <div className="top-incubators"><h3>🏆 Top Incubators</h3><div className="incubator-logos">
              <div className="incubator-badge"><strong>Y Combinator</strong><br/><small>Airbnb, Dropbox, Reddit</small></div>
              <div className="incubator-badge"><strong>Techstars</strong><br/><small>Đầu tư lớn nhất</small></div>
              <div className="incubator-badge"><strong>500 Startups</strong><br/><small>Alumni thành công nhất</small></div>
            </div></div>
          </div>
        </Slide>

        {/* 17: Plans & One Pagers */}
        <Slide i={16} c={current} label="SECTION 7 • FUNDRAISING" color="#FDCB6E">
          <h2>Business Plans &amp; One Pagers</h2>
          <TwoCol
            left={<><div className="col-icon" style={{background:"linear-gradient(135deg,#dfe6e9,#b2bec3)"}}><i className="fas fa-file-alt" /></div><h3>Business Plan (~50-60 trang)</h3><ul><li>Ai sở hữu? Làm gì? Thị trường? Mô hình?</li><li>Ngân hàng &amp; institutional investors yêu cầu</li><li>⚠️ <strong>Quá dài &amp; thường sai</strong></li></ul></>}
            right={<><div className="col-icon" style={{background:"linear-gradient(135deg,#00B894,#55efc4)"}}><i className="fas fa-file-invoice" /></div><h3>One Pager ✨</h3><ul><li>&quot;Hình thức hiện đại&quot;</li><li>NĐT rất bận → <strong>tối đa info, tối thiểu time</strong></li><li>Nội dung: Key facts, market size, ask</li></ul></>}
          />
          <Accordion title="🔍 One Pager nên có gì? Chi tiết 8 mục">
            <p><strong>1.</strong> Ai sở hữu công ty? <strong>2.</strong> Cần bao nhiêu tiền? <strong>3.</strong> Đã có bao nhiêu vốn? <strong>4.</strong> Key facts</p>
            <p><strong>5.</strong> Chiến lược marketing <strong>6.</strong> Quy mô thị trường <strong>7.</strong> Lợi thế cạnh tranh <strong>8.</strong> Dự kiến doanh thu</p>
            <p>💡 <strong>Tip:</strong> Luôn chuẩn bị cả Business Plan lẫn One Pager!</p>
          </Accordion>
        </Slide>

        {/* 18: SECTION 8 COVER */}
        <SectionCover i={17} c={current} color="#E17055" num="08" img="/img/idea_gen.png" title={<>Introduction to<br/>Idea Generation</>} desc="Phương pháp sáng tạo và phát triển ý tưởng" />

        {/* 19: Scratchpad */}
        <Slide i={18} c={current} label="SECTION 8 • IDEA GENERATION" color="#E17055">
          <h2>Scratchpad &amp; Idea Lister Builder</h2>
          <TwoCol
            left={<><div className="col-icon" style={{background:"linear-gradient(135deg,#E17055,#fab1a0)"}}><i className="fas fa-pencil-alt" /></div><h3>📝 The Scratchpad</h3><ul><li>Luôn mang theo giấy/app (Evernote)</li><li>Có cảm hứng → <strong>ghi ngay</strong></li><li>Đừng để ý tưởng lãng phí!</li></ul></>}
            right={<><div className="col-icon" style={{background:"linear-gradient(135deg,#6C5CE7,#a29bfe)"}}><i className="fas fa-list-ol" /></div><h3>📋 Idea Lister Builder</h3><ul><li>Mỗi trang = <strong>1 ý tưởng</strong></li><li>Ai trả tiền? Vấn đề gì? Model nào?</li><li>Cuối cùng: xếp hạng &amp; chọn</li></ul></>}
          />
          <div className="equation-box">
            <h3>🧮 Equation of the Complete Idea</h3>
            <div className="equation">
              <span className="eq-part">Subject</span><span className="eq-sign">+</span>
              <span className="eq-part">Problem / Benefit</span><span className="eq-sign">+</span>
              <span className="eq-part">Business Model</span><span className="eq-sign">=</span>
              <span className="eq-result">💡 Complete Idea</span>
            </div>
          </div>
        </Slide>

        {/* 20: REVIEW COVER */}
        <div className={`slide slide-section-cover ${current === 19 ? "active" : ""}`} style={{"--section-color":"#0984e3"} as React.CSSProperties}>
          <div className="section-bg-number">?</div>
          <div className="slide-content"><div className="section-label">PHẦN 2</div><h1>Câu Hỏi<br/>Ôn Tập</h1><p className="section-desc">20 câu hỏi ôn bài — kiểm tra kiến thức Sections 5-8</p></div>
        </div>

        {/* 21: Q 1-10 */}
        <div className={`slide slide-questions ${current === 20 ? "active" : ""}`}>
          <div className="slide-content">
            <div className="section-label" style={{color:"#0984e3"}}>CÂU HỎI ÔN TẬP</div><h2>Câu 1 – 10</h2>
            <div className="questions-list">
              {["Phân biệt Product và Service business. Cho ví dụ.","SaaS là gì? Tại sao software chuyển từ product sang service?","Giải thích \"Brick & mortar\" vs \"Brick & click\".","Mô hình Freemium hoạt động thế nào?","Scalability là gì? Startup cần quan tâm hơn vì sao?","Marginal cost ảnh hưởng scale thế nào?","Theo Eric Ries, tại sao cần validate ý tưởng?","Khi survey, tại sao cần khách quan?","Giải thích vòng lặp Build – Measure – Learn.","Nên hỏi khách hàng & người trong ngành gì?"].map((q, i) => (
                <div key={i} className="q-item"><span className="q-num">{i+1}</span><span dangerouslySetInnerHTML={{__html:q}} /></div>
              ))}
            </div>
          </div>
        </div>

        {/* 22: Q 11-20 */}
        <div className={`slide slide-questions ${current === 21 ? "active" : ""}`}>
          <div className="slide-content">
            <div className="section-label" style={{color:"#0984e3"}}>CÂU HỎI ÔN TẬP</div><h2>Câu 11 – 20</h2>
            <div className="questions-list">
              {["Pitch experiment là gì? Cách tạo pitch experiment?","MVP là gì? Kể câu chuyện Zappos.","Phân biệt Equity và Debt.","FFF là nguồn vốn gì? Ưu/nhược?","Ưu nhược điểm vay ngân hàng (Loans)?","VC hoạt động thế nào? Tại sao 9/10 thất bại?","Incubator cung cấp gì? Standard package?","So sánh Business Plan & One Pager.","Scratchpad & Idea Lister giúp gì?","Giải thích: Subject + Problem + Business Model = Complete Idea"].map((q, i) => (
                <div key={i} className="q-item"><span className="q-num">{i+11}</span><span dangerouslySetInnerHTML={{__html:q}} /></div>
              ))}
            </div>
          </div>
        </div>

        {/* 23: SUMMARY */}
        <div className={`slide slide-end ${current === 22 ? "active" : ""}`}>
          <div className="floating-shapes"><div className="shape shape-1" /><div className="shape shape-2" /><div className="shape shape-3" /><div className="shape shape-4" /></div>
          <div className="slide-content">
            <div className="section-label">TÓM TẮT</div>
            <h1 className="gradient-text">Key Takeaways</h1>
            <div className="summary-items">
              <div className="summary-item"><span className="summary-icon" style={{background:"#6C5CE7"}}><i className="fas fa-cube" /></span><p><strong>Section 5:</strong> Service vs Product, 7 Business Models, Scalability &amp; Marginal Cost</p></div>
              <div className="summary-item"><span className="summary-icon" style={{background:"#00B894"}}><i className="fas fa-check-circle" /></span><p><strong>Section 6:</strong> Validation, Surveys, Experts, Lean Startup, Pitch Experiments, MVP</p></div>
              <div className="summary-item"><span className="summary-icon" style={{background:"#FDCB6E"}}><i className="fas fa-coins" /></span><p><strong>Section 7:</strong> Bootstrapping, FFF, Angels, Equity/Debt, Loans, VC, Incubators</p></div>
              <div className="summary-item"><span className="summary-icon" style={{background:"#E17055"}}><i className="fas fa-lightbulb" /></span><p><strong>Section 8:</strong> Scratchpad, Idea Lister, Subject + Problem + Model = Complete Idea</p></div>
            </div>
            <div className="thank-you"><h2>Cảm ơn đã lắng nghe! 🎉</h2><p>Nhóm 2 — Module 1: Intro to Entrepreneurship</p></div>
          </div>
        </div>
      </div>
      {showBuffer && <BufferDemo onClose={() => setShowBuffer(false)} />}
      {showZappos && <ZapposDemo onClose={() => setShowZappos(false)} />}
      {showDropbox && <DropboxDemo onClose={() => setShowDropbox(false)} />}
      {showEquity && <EquityDebtDemo onClose={() => setShowEquity(false)} />}
    </>
  );
}

/* ============ Reusable Components ============ */

function Slide({ i, c, label, color, children }: { i: number; c: number; label?: string; color?: string; children: React.ReactNode }) {
  return (
    <div className={`slide ${c === i ? "active" : ""}`}>
      <div className="slide-content">
        {label && <div className="section-label" style={{ color }}>{label}</div>}
        {children}
      </div>
    </div>
  );
}

function SectionCover({ i, c, color, num, img, title, desc }: { i: number; c: number; color: string; num: string; img: string; title: React.ReactNode; desc: string }) {
  return (
    <div className={`slide slide-section-cover ${c === i ? "active" : ""}`} style={{ "--section-color": color } as React.CSSProperties}>
      <div className="section-bg-number">{num}</div>
      <img src={img} className="section-cover-img" alt="" />
      <div className="slide-content">
        <div className="section-label">SECTION {num.replace(/^0/, "")}</div>
        <h1>{title}</h1>
        <p className="section-desc">{desc}</p>
      </div>
    </div>
  );
}

function TwoCol({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div className="two-col">
      <div className="col-card">{left}</div>
      <div className="col-card">{right}</div>
    </div>
  );
}

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="accordion-item" style={{ marginTop: 14 }}>
      <div className="accordion-header">
        <span className="accordion-icon">+</span>
        <span className="accordion-title">{title}</span>
        <span className="accordion-tag">BẤM ĐỂ XEM</span>
      </div>
      <div className="accordion-body"><div className="accordion-body-inner">{children}</div></div>
    </div>
  );
}

function ModelCard({ tag, isNew, icon, name, desc }: { tag: string; isNew?: boolean; icon: string; name: string; desc: string }) {
  return (
    <div className="model-card">
      <div className={`model-tag${isNew ? " new" : ""}`}>{tag}</div>
      <h4><i className={`fas ${icon}`} /> {name}</h4>
      <p>{desc}</p>
    </div>
  );
}

function DemoNav({ step, total, setStep, onClose, labels }: { step: number; total: number; setStep: (n: number) => void; onClose: () => void; labels?: string[] }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && step < total - 1) { e.stopPropagation(); setStep(step + 1); }
      if (e.key === "ArrowLeft" && step > 0) { e.stopPropagation(); setStep(step - 1); }
    };
    window.addEventListener("keydown", h, true);
    return () => window.removeEventListener("keydown", h, true);
  }, [step, total, setStep, onClose]);

  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"8px 16px 14px"}}>
      <button onClick={()=>step>0&&setStep(step-1)} style={{
        background: step > 0 ? "rgba(255,255,255,.1)" : "rgba(255,255,255,.03)",
        border:"none",borderRadius:8,padding:"6px 14px",cursor: step > 0 ? "pointer" : "default",
        color: step > 0 ? "#fff" : "#444",fontSize:".78rem",fontWeight:700,transition:"all .2s"
      }}>← Trước</button>
      <div style={{display:"flex",gap:4,flex:1,justifyContent:"center"}}>
        {(labels || Array.from({length:total},(_,i)=>`${i+1}`)).map((label, i) => (
          <div key={i} onClick={()=>setStep(i)} style={{
            padding:"3px 10px",borderRadius:12,fontSize:".63rem",fontWeight:600,cursor:"pointer",
            background: i === step ? "rgba(253,203,110,.2)" : "rgba(255,255,255,.05)",
            color: i === step ? "#FDCB6E" : "#666",
            border: i === step ? "1px solid rgba(253,203,110,.3)" : "1px solid transparent",
            transition:"all .3s"
          }}>{label}</div>
        ))}
      </div>
      <button onClick={()=>step<total-1&&setStep(step+1)} style={{
        background: step < total-1 ? "rgba(253,203,110,.15)" : "rgba(255,255,255,.03)",
        border: step < total-1 ? "1px solid rgba(253,203,110,.3)" : "1px solid transparent",
        borderRadius:8,padding:"6px 14px",cursor: step < total-1 ? "pointer" : "default",
        color: step < total-1 ? "#FDCB6E" : "#444",fontSize:".78rem",fontWeight:700,transition:"all .2s"
      }}>Tiếp →</button>
    </div>
  );
}

function BufferDemo({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState(0); // 0=landing, 1=cursor hover, 2=clicked, 3=signup shown


  return (
    <div onClick={onClose} style={{
      position:"fixed",top:0,left:0,width:"100vw",height:"100vh",
      background:"rgba(0,0,0,.75)",backdropFilter:"blur(8px)",
      zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",
      animation:"bufferFadeIn .3s ease"
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:"min(700px, 90vw)",
        background:"linear-gradient(145deg,#0f0f23,#1a1a3e)",
        borderRadius:18,border:"1px solid rgba(108,92,231,.4)",
        overflow:"hidden",position:"relative",
        boxShadow:"0 25px 60px rgba(0,0,0,.5), 0 0 80px rgba(108,92,231,.15)",
        animation:"bufferSlideUp .4s ease"
      }}>
        {/* Close button */}
        <button onClick={onClose} style={{
          position:"absolute",top:12,right:16,zIndex:10,
          background:"rgba(255,255,255,.1)",border:"none",borderRadius:"50%",
          width:32,height:32,cursor:"pointer",color:"#fff",fontSize:"1rem",
          display:"flex",alignItems:"center",justifyContent:"center",
          transition:"background .2s"
        }}>✕</button>

        {/* Demo label */}
        <div style={{
          background:"linear-gradient(90deg,rgba(108,92,231,.2),rgba(0,184,148,.1))",
          padding:"10px 20px",fontSize:".75rem",color:"#aaa",textAlign:"center",
          borderBottom:"1px solid rgba(255,255,255,.06)"
        }}>
          🎬 <strong style={{color:"#FDCB6E"}}>DEMO:</strong> Cách Buffer validate ý tưởng — chưa viết 1 dòng code!
        </div>

        {/* Browser chrome */}
        <div style={{background:"rgba(0,0,0,.4)",padding:"10px 16px",display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:12,height:12,borderRadius:"50%",background:"#e17055"}}/>
          <div style={{width:12,height:12,borderRadius:"50%",background:"#FDCB6E"}}/>
          <div style={{width:12,height:12,borderRadius:"50%",background:"#00B894"}}/>
          <div style={{flex:1,background:"rgba(255,255,255,.08)",borderRadius:6,padding:"5px 14px",fontSize:".8rem",color:"#888",marginLeft:10}}>
            🔒 https://bufferapp.com
          </div>
        </div>

        {/* Landing page content */}
        <div style={{padding:"40px 30px 50px",textAlign:"center",position:"relative",minHeight:280}}>
          <div style={{fontSize:"2rem",fontWeight:900,color:"#fff",marginBottom:6,letterSpacing:"-1px"}}>Buffer</div>
          <div style={{fontSize:".95rem",color:"#aaa",marginBottom:28}}>A smarter way to share on social media</div>

          {phase < 2 ? (
            <>
              <div style={{
                display:"inline-block",
                padding:"14px 36px",fontSize:"1.05rem",fontWeight:800,
                background: phase === 1 ? "linear-gradient(135deg,#6C5CE7,#a29bfe)" : "linear-gradient(135deg,#00B894,#55efc4)",
                color:"#fff",borderRadius:12,cursor:"pointer",
                transform: phase === 1 ? "scale(1.1)" : "scale(1)",
                boxShadow: phase === 1 ? "0 0 30px rgba(108,92,231,.6), 0 8px 24px rgba(108,92,231,.3)" : "0 4px 15px rgba(0,184,148,.3)",
                transition:"all .5s cubic-bezier(.4,0,.2,1)"
              }}>
                💰 See Plans & Pricing
              </div>
              <div style={{fontSize:".8rem",color:"#555",marginTop:16}}>
                ⚠️ Sản phẩm chưa có — Joel chỉ tạo trang giả này để test nhu cầu!
              </div>
              {phase === 0 && (
                <div style={{fontSize:".75rem",color:"#666",marginTop:6,animation:"bufferPulse 2s ease infinite"}}>
                  🖱️ Đợi... con chuột sắp click...
                </div>
              )}
            </>
          ) : (
            <div style={{animation:"bufferFadeInUp .5s ease"}}>
              <div style={{
                background:"rgba(0,184,148,.08)",border:"2px solid rgba(0,184,148,.3)",
                borderRadius:14,padding:"24px 30px",display:"inline-block",textAlign:"left",
                maxWidth:420
              }}>
                <div style={{fontSize:"1.1rem",fontWeight:800,color:"#00B894",marginBottom:10}}>
                  ✅ Có người click xem giá!
                </div>
                <div style={{fontSize:".85rem",color:"#aaa",marginBottom:14}}>
                  → Nhu cầu <strong style={{color:"#fff"}}>CÓ THẬT</strong>. Hiện form đăng ký:
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <input type="text" placeholder="you@email.com" readOnly style={{
                    background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.2)",
                    borderRadius:8,padding:"10px 14px",fontSize:".85rem",color:"#fff",
                    flex:1,outline:"none"
                  }}/>
                  <div style={{
                    padding:"10px 20px",fontSize:".85rem",fontWeight:800,
                    background:"linear-gradient(135deg,#00B894,#55efc4)",
                    color:"#fff",borderRadius:8,whiteSpace:"nowrap",cursor:"pointer"
                  }}>Đăng ký!</div>
                </div>
                {phase === 3 && (
                  <div style={{
                    marginTop:14,padding:"10px 14px",
                    background:"rgba(253,203,110,.08)",border:"1px solid rgba(253,203,110,.2)",
                    borderRadius:8,animation:"bufferFadeInUp .4s ease"
                  }}>
                    <div style={{fontSize:".9rem",color:"#FDCB6E",fontWeight:700}}>
                      📊 Kết quả sau 1 tuần:
                    </div>
                    <div style={{fontSize:"1.4rem",fontWeight:900,color:"#fff",margin:"4px 0"}}>
                      847 người đăng ký
                    </div>
                    <div style={{fontSize:".78rem",color:"#aaa"}}>
                      👉 Chưa viết 1 dòng code mà đã biết có khách! → Bắt đầu code.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Animated cursor */}
          {phase === 1 && (
            <div style={{
              position:"absolute",
              width:28,height:28,
              animation:"bufferCursor 2s ease forwards",
              zIndex:10,pointerEvents:"none",
              filter:"drop-shadow(0 3px 6px rgba(0,0,0,.6))"
            }}>
              <svg viewBox="0 0 24 24" fill="#fff" width="28" height="28">
                <path d="M4 0L4 20L9 15L14 22L17 20L12 13L19 13Z"/>
              </svg>
            </div>
          )}
          {phase === 2 && (
            <div style={{
              position:"absolute",top:"45%",left:"50%",
              transform:"translate(-50%,-50%)",
              width:10,height:10,borderRadius:"50%",
              background:"rgba(108,92,231,.4)",
              animation:"bufferRipple .6s ease forwards",
              pointerEvents:"none"
            }}/>
          )}
        </div>
      </div>
      <style>{`
        @keyframes bufferFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes bufferSlideUp { from{opacity:0;transform:translateY(30px) scale(.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes bufferFadeInUp { from{opacity:0;transform:translateY(15px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bufferPulse { 0%,100%{opacity:.5} 50%{opacity:1} }
        @keyframes bufferCursor {
          0% { top: 240px; left: 100px; }
          70% { top: 140px; left: calc(50% - 5px); }
          100% { top: 130px; left: calc(50% - 5px); }
        }
        @keyframes bufferRipple {
          0% { width:10px;height:10px;opacity:1; }
          100% { width:80px;height:80px;opacity:0; }
        }
      `}</style>
    </div>
  );
}

function ZapposDemo({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  // 0=shoe store, 1=camera flash, 2=website with shoes, 3=order notification, 4=nick runs to store, 5=ship + amazon

  const steps = [
    { emoji: "🏪", title: "Nick đi vào tiệm giày", desc: "Không có tiền xây website + kho hàng ($500K)", color: "#6C5CE7" },
    { emoji: "📸", title: "Chụp ảnh giày trên kệ!", desc: "Chi phí: $0 — chỉ cần điện thoại", color: "#FDCB6E" },
    { emoji: "🌐", title: "Đăng ảnh lên website đơn giản", desc: "Web xấu, ảnh không đẹp, nhưng ĐỦ ĐỂ TEST", color: "#0984e3" },
    { emoji: "🔔", title: "CÓ NGƯỜI ĐẶT MUA!", desc: "Khách hàng thật sự muốn mua giày online!", color: "#00B894" },
    { emoji: "🏃", title: "Nick chạy ra tiệm mua giày → tự ship!", desc: "Chấp nhận LỖ tiền ship → mua BẰng chứng", color: "#E17055" },
    { emoji: "🏆", title: "Giả thuyết ĐÚNG → Xây hệ thống thật", desc: "Amazon mua lại $1.2 TỶ năm 2009", color: "#00B894" },
  ];

  const cur = steps[step];

  return (
    <div onClick={onClose} style={{
      position:"fixed",top:0,left:0,width:"100vw",height:"100vh",
      background:"rgba(0,0,0,.75)",backdropFilter:"blur(8px)",
      zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",
      animation:"bufferFadeIn .3s ease"
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:"min(680px, 90vw)",
        background:"linear-gradient(145deg,#0f0f23,#1a1a3e)",
        borderRadius:18,border:"1px solid rgba(108,92,231,.4)",
        overflow:"hidden",position:"relative",
        boxShadow:"0 25px 60px rgba(0,0,0,.5), 0 0 80px rgba(108,92,231,.15)",
        animation:"bufferSlideUp .4s ease"
      }}>
        <button onClick={onClose} style={{
          position:"absolute",top:12,right:16,zIndex:10,
          background:"rgba(255,255,255,.1)",border:"none",borderRadius:"50%",
          width:32,height:32,cursor:"pointer",color:"#fff",fontSize:"1rem",
          display:"flex",alignItems:"center",justifyContent:"center"
        }}>✕</button>

        <div style={{background:"linear-gradient(90deg,rgba(108,92,231,.2),rgba(0,184,148,.1))",padding:"10px 20px",fontSize:".75rem",color:"#aaa",textAlign:"center",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
          👟 <strong style={{color:"#FDCB6E"}}>DEMO ZAPPOS:</strong> Cách Nick Swinmurn validate ý tưởng bán giày online — MVP đỉnh cao!
        </div>

        <div style={{padding:"30px 30px 20px",textAlign:"center"}}>
          {/* Progress dots */}
          <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:20}}>
            {steps.map((s, i) => (
              <div key={i} style={{
                width: i === step ? 28 : 10, height:10, borderRadius:5,
                background: i <= step ? s.color : "rgba(255,255,255,.1)",
                transition:"all .4s ease"
              }}/>
            ))}
          </div>

          {/* Main content */}
          <div key={step} style={{animation:"bufferFadeInUp .4s ease"}}>
            <div style={{fontSize:"3.5rem",marginBottom:10}}>{cur.emoji}</div>
            <div style={{fontSize:"1.2rem",fontWeight:800,color:"#fff",marginBottom:8}}>{cur.title}</div>
            <div style={{fontSize:".9rem",color:"#aaa",marginBottom:16}}>{cur.desc}</div>

            {step <= 2 && (
              <div style={{
                display:"inline-flex",gap:12,alignItems:"center",
                background:"rgba(255,255,255,.05)",borderRadius:12,padding:"14px 20px"
              }}>
                <div style={{fontSize:".78rem",color:"#888"}}>Chi phí MVP:</div>
                <div style={{fontSize:"1.5rem",fontWeight:900,color:"#00B894"}}>≈ $0</div>
                <div style={{fontSize:".78rem",color:"#888"}}>vs truyền thống:</div>
                <div style={{fontSize:"1.1rem",fontWeight:700,color:"#e17055",textDecoration:"line-through"}}>$500,000</div>
              </div>
            )}

            {step === 3 && (
              <div style={{
                display:"inline-block",padding:"12px 24px",
                background:"rgba(0,184,148,.1)",border:"2px solid rgba(0,184,148,.3)",
                borderRadius:12,animation:"bufferPulse 1s ease infinite"
              }}>
                <span style={{fontSize:"1.3rem"}}>🛒</span>
                <span style={{color:"#00B894",fontWeight:800,marginLeft:8,fontSize:"1rem"}}>1 đơn hàng mới!</span>
              </div>
            )}

            {step === 4 && (
              <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:16}}>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:"2rem"}}>🏪</div>
                  <div style={{fontSize:".7rem",color:"#888"}}>Tiệm giày</div>
                </div>
                <div style={{fontSize:"1.5rem",color:"#E17055",animation:"bufferPulse 0.5s ease infinite"}}>→ 🏃 →</div>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:"2rem"}}>👟</div>
                  <div style={{fontSize:".7rem",color:"#888"}}>Mua giày</div>
                </div>
                <div style={{fontSize:"1.5rem",color:"#E17055",animation:"bufferPulse 0.5s ease infinite"}}>→ 📦 →</div>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:"2rem"}}>📬</div>
                  <div style={{fontSize:".7rem",color:"#888"}}>Ship khách</div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div style={{
                display:"inline-block",padding:"16px 28px",
                background:"rgba(0,184,148,.08)",border:"2px solid rgba(0,184,148,.3)",
                borderRadius:14
              }}>
                <div style={{fontSize:"2.2rem",fontWeight:900,color:"#00B894"}}>$1,200,000,000</div>
                <div style={{fontSize:".85rem",color:"#aaa",marginTop:4}}>Amazon mua lại Zappos — từ ảnh chụp giày trên kệ! 🎉</div>
              </div>
            )}
          </div>
        </div>

        <DemoNav step={step} total={6} setStep={setStep} onClose={onClose} labels={["Tiệm giày","Chụp ảnh","Đăng web","Có đơn!","Mua & ship","$1.2 tỷ"]} />
      </div>
    </div>
  );
}

function DropboxDemo({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  // 0=problem, 1=video playing, 2=posted to HN, 3=signups counting, 4=result

  const [count, setCount] = useState(5000);
  useEffect(() => {
    if (step === 3) {
      setCount(5000);
      const interval = setInterval(() => {
        setCount(c => {
          if (c >= 75000) { clearInterval(interval); return 75000; }
          return c + Math.floor(Math.random() * 3000) + 1500;
        });
      }, 120);
      return () => clearInterval(interval);
    }
  }, [step]);

  return (
    <div onClick={onClose} style={{
      position:"fixed",top:0,left:0,width:"100vw",height:"100vh",
      background:"rgba(0,0,0,.75)",backdropFilter:"blur(8px)",
      zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",
      animation:"bufferFadeIn .3s ease"
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:"min(680px, 90vw)",
        background:"linear-gradient(145deg,#0f0f23,#1a1a3e)",
        borderRadius:18,border:"1px solid rgba(0,132,227,.4)",
        overflow:"hidden",position:"relative",
        boxShadow:"0 25px 60px rgba(0,0,0,.5), 0 0 80px rgba(0,132,227,.15)",
        animation:"bufferSlideUp .4s ease"
      }}>
        <button onClick={onClose} style={{
          position:"absolute",top:12,right:16,zIndex:10,
          background:"rgba(255,255,255,.1)",border:"none",borderRadius:"50%",
          width:32,height:32,cursor:"pointer",color:"#fff",fontSize:"1rem",
          display:"flex",alignItems:"center",justifyContent:"center"
        }}>✕</button>

        <div style={{background:"linear-gradient(90deg,rgba(0,132,227,.2),rgba(0,184,148,.1))",padding:"10px 20px",fontSize:".75rem",color:"#aaa",textAlign:"center",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
          📦 <strong style={{color:"#FDCB6E"}}>DEMO DROPBOX:</strong> Video demo 3 phút — chưa viết 1 dòng code!
        </div>

        <div style={{padding:"30px 30px 20px",textAlign:"center"}}>
          <div key={step} style={{animation:"bufferFadeInUp .4s ease"}}>
            {step === 0 && (
              <>
                <div style={{fontSize:"3.5rem",marginBottom:10}}>😤</div>
                <div style={{fontSize:"1.2rem",fontWeight:800,color:"#fff",marginBottom:8}}>Drew Houston quên USB ở nhà... lần thứ 100</div>
                <div style={{fontSize:".9rem",color:"#aaa",marginBottom:16}}>Muốn tạo app lưu file trên cloud. Nhưng build cần 1 NĂM.</div>
                <div style={{display:"inline-block",padding:"10px 20px",background:"rgba(225,112,85,.1)",border:"1px solid rgba(225,112,85,.3)",borderRadius:10}}>
                  <span style={{color:"#E17055",fontWeight:700}}>💡 Ý tưởng:</span>
                  <span style={{color:"#aaa",marginLeft:8}}>Quay video demo GIẢ VỜ sản phẩm đã xong!</span>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div style={{
                  background:"#000",borderRadius:12,padding:"20px",display:"inline-block",
                  border:"2px solid rgba(0,132,227,.3)",position:"relative",width:"80%"
                }}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                    <div style={{width:10,height:10,borderRadius:"50%",background:"#e17055",animation:"bufferPulse 1s ease infinite"}}/>
                    <span style={{fontSize:".72rem",color:"#e17055",fontWeight:700}}>● REC</span>
                    <span style={{fontSize:".72rem",color:"#888",marginLeft:"auto"}}>03:22</span>
                  </div>
                  <div style={{fontSize:"1.3rem",fontWeight:800,color:"#fff",marginBottom:6}}>📂 Dropbox Demo</div>
                  <div style={{display:"flex",justifyContent:"center",gap:14,margin:"10px 0"}}>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontSize:"2rem"}}>🖥️</div>
                      <div style={{fontSize:".65rem",color:"#888"}}>Kéo file vào</div>
                    </div>
                    <div style={{fontSize:"1.5rem",color:"#0984e3",alignSelf:"center"}}>→</div>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontSize:"2rem"}}>☁️</div>
                      <div style={{fontSize:".65rem",color:"#888"}}>Tự động sync</div>
                    </div>
                    <div style={{fontSize:"1.5rem",color:"#0984e3",alignSelf:"center"}}>→</div>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontSize:"2rem"}}>💻</div>
                      <div style={{fontSize:".65rem",color:"#888"}}>Truy cập mọi nơi</div>
                    </div>
                  </div>
                  <div style={{fontSize:".72rem",color:"#aaa",fontStyle:"italic"}}>* Thực tế chưa viết 1 dòng code — chỉ quay màn hình GIẢ VỜ!</div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div style={{fontSize:"3rem",marginBottom:10}}>📰</div>
                <div style={{fontSize:"1.2rem",fontWeight:800,color:"#fff",marginBottom:8}}>Đăng video lên Hacker News</div>
                <div style={{
                  display:"inline-block",padding:"14px 20px",
                  background:"rgba(255,102,0,.08)",border:"1px solid rgba(255,102,0,.3)",
                  borderRadius:10,textAlign:"left"
                }}>
                  <div style={{fontSize:".78rem",fontWeight:800,color:"#FF6600"}}>Y | Hacker News</div>
                  <div style={{fontSize:".9rem",color:"#fff",marginTop:6}}>🔗 <strong>Dropbox — Throw away your USB drive</strong></div>
                  <div style={{fontSize:".72rem",color:"#888",marginTop:4}}>by drew_houston | 234 points | 189 comments</div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div style={{fontSize:"1rem",fontWeight:700,color:"#aaa",marginBottom:12}}>📊 Sign-ups đang BÙNG NỔ!</div>
                <div style={{
                  fontSize:"3.5rem",fontWeight:900,
                  color: count >= 75000 ? "#00B894" : "#FDCB6E",
                  transition:"color .3s",fontVariantNumeric:"tabular-nums"
                }}>
                  {count >= 75000 ? "75,000" : count.toLocaleString()}
                </div>
                <div style={{fontSize:".9rem",color:"#aaa",marginTop:4}}>người đăng ký</div>
                <div style={{
                  width:"80%",height:8,background:"rgba(255,255,255,.06)",borderRadius:4,
                  margin:"14px auto 0",overflow:"hidden"
                }}>
                  <div style={{
                    width: `${Math.min((count/75000)*100, 100)}%`,
                    height:"100%",borderRadius:4,transition:"width .1s",
                    background: count >= 75000 ? "linear-gradient(90deg,#00B894,#55efc4)" : "linear-gradient(90deg,#FDCB6E,#ffeaa7)"
                  }}/>
                </div>
                {count >= 75000 && (
                  <div style={{marginTop:12,fontSize:".85rem",color:"#00B894",fontWeight:700,animation:"bufferFadeInUp .3s ease"}}>
                    ✅ QUA ĐÊM: 5,000 → 75,000! Tăng 15 LẦN!
                  </div>
                )}
              </>
            )}

            {step === 4 && (
              <>
                <div style={{fontSize:"3rem",marginBottom:10}}>🎯</div>
                <div style={{fontSize:"1.2rem",fontWeight:800,color:"#fff",marginBottom:8}}>Bây giờ Drew YÊN TÂM bỏ 1 năm build</div>
                <div style={{
                  display:"inline-block",padding:"16px 24px",
                  background:"rgba(0,184,148,.08)",border:"2px solid rgba(0,184,148,.3)",
                  borderRadius:14
                }}>
                  <div style={{fontSize:".85rem",color:"#aaa",marginBottom:8}}>Nếu không ai care? → Tiết kiệm 1 NĂM cuộc đời.</div>
                  <div style={{fontSize:".85rem",color:"#aaa",marginBottom:8}}>75K người muốn? → Build ngay!</div>
                  <div style={{fontSize:"1rem",fontWeight:800,color:"#00B894",marginTop:8}}>💡 MVP = Hỏi thị trường TRƯỚC khi build</div>
                </div>
              </>
            )}
          </div>
        </div>

        <DemoNav step={step} total={5} setStep={setStep} onClose={onClose} labels={["Quên USB","Video demo","Hacker News","Bùng nổ!","Kết luận"]} />
      </div>
    </div>
  );
}

function EquityDebtDemo({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  // 0=setup, 1=both invest, 2=success scenario, 3=fail scenario, 4=summary

  const Card = ({ bg, border, children }: { bg: string; border: string; children: React.ReactNode }) => (
    <div style={{
      flex:1, background: bg, border: `2px solid ${border}`,
      borderRadius: 14, padding: "18px 16px", textAlign: "center"
    }}>{children}</div>
  );

  return (
    <div onClick={onClose} style={{
      position:"fixed",top:0,left:0,width:"100vw",height:"100vh",
      background:"rgba(0,0,0,.75)",backdropFilter:"blur(8px)",
      zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",
      animation:"bufferFadeIn .3s ease"
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:"min(750px, 92vw)",
        background:"linear-gradient(145deg,#0f0f23,#1a1a3e)",
        borderRadius:18,border:"1px solid rgba(253,203,110,.3)",
        overflow:"hidden",position:"relative",
        boxShadow:"0 25px 60px rgba(0,0,0,.5), 0 0 80px rgba(253,203,110,.1)",
        animation:"bufferSlideUp .4s ease"
      }}>
        <button onClick={onClose} style={{
          position:"absolute",top:12,right:16,zIndex:10,
          background:"rgba(255,255,255,.1)",border:"none",borderRadius:"50%",
          width:32,height:32,cursor:"pointer",color:"#fff",fontSize:"1rem",
          display:"flex",alignItems:"center",justifyContent:"center"
        }}>✕</button>

        <div style={{background:"linear-gradient(90deg,rgba(108,92,231,.2),rgba(0,184,148,.1))",padding:"10px 20px",fontSize:".75rem",color:"#aaa",textAlign:"center",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
          ⚖️ <strong style={{color:"#FDCB6E"}}>DEMO:</strong> Equity vs Debt — Cùng đầu tư $100K, kết quả KHÁC NHAU!
        </div>

        <div style={{padding:"24px 24px 20px"}}>
          <div key={step} style={{animation:"bufferFadeInUp .4s ease"}}>

            {step === 0 && (
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:"3rem",marginBottom:8}}>🤝</div>
                <div style={{fontSize:"1.3rem",fontWeight:800,color:"#fff",marginBottom:6}}>Kịch bản: Bạn cần $100,000 cho startup</div>
                <div style={{fontSize:".9rem",color:"#aaa",marginBottom:20}}>Có 2 cách huy động — xem chuyện gì xảy ra!</div>
                <div style={{display:"flex",gap:16,justifyContent:"center"}}>
                  <Card bg="rgba(108,92,231,.08)" border="rgba(108,92,231,.3)">
                    <div style={{fontSize:"2rem"}}>📊</div>
                    <div style={{fontSize:"1rem",fontWeight:800,color:"#6C5CE7",margin:"6px 0"}}>EQUITY</div>
                    <div style={{fontSize:".78rem",color:"#aaa"}}>Bán 10% cổ phần<br/>NĐT sở hữu 10% công ty</div>
                  </Card>
                  <Card bg="rgba(225,112,85,.08)" border="rgba(225,112,85,.3)">
                    <div style={{fontSize:"2rem"}}>🏦</div>
                    <div style={{fontSize:"1rem",fontWeight:800,color:"#E17055",margin:"6px 0"}}>DEBT</div>
                    <div style={{fontSize:".78rem",color:"#aaa"}}>Vay $100K, lãi 10%/năm<br/>Phải trả $110K sau 1 năm</div>
                  </Card>
                </div>
              </div>
            )}

            {step === 1 && (
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:"2.5rem",marginBottom:8}}>💰</div>
                <div style={{fontSize:"1.2rem",fontWeight:800,color:"#fff",marginBottom:6}}>Cả hai đều cho bạn $100,000</div>
                <div style={{fontSize:".85rem",color:"#aaa",marginBottom:16}}>Bạn build startup... 1 năm sau...</div>
                <div style={{display:"flex",gap:20,justifyContent:"center",alignItems:"center"}}>
                  <div style={{textAlign:"center",animation:"bufferPulse 1.5s ease infinite"}}>
                    <div style={{fontSize:"3rem"}}>🚀</div>
                    <div style={{fontSize:".85rem",fontWeight:700,color:"#00B894",marginTop:4}}>Thành công?</div>
                    <div style={{fontSize:".72rem",color:"#888"}}>Công ty trị giá $10M</div>
                  </div>
                  <div style={{fontSize:"1.5rem",color:"#888"}}>hay</div>
                  <div style={{textAlign:"center",animation:"bufferPulse 1.5s ease infinite"}}>
                    <div style={{fontSize:"3rem"}}>💥</div>
                    <div style={{fontSize:".85rem",fontWeight:700,color:"#E17055",marginTop:4}}>Thất bại?</div>
                    <div style={{fontSize:".72rem",color:"#888"}}>Công ty phá sản</div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <div style={{textAlign:"center",marginBottom:16}}>
                  <span style={{fontSize:"1.5rem"}}>🚀</span>
                  <span style={{fontSize:"1.1rem",fontWeight:800,color:"#00B894",marginLeft:8}}>KỊCH BẢN 1: THÀNH CÔNG — Công ty trị giá $10,000,000</span>
                </div>
                <div style={{display:"flex",gap:16}}>
                  <Card bg="rgba(108,92,231,.08)" border="rgba(108,92,231,.3)">
                    <div style={{fontSize:".78rem",fontWeight:700,color:"#6C5CE7",marginBottom:8}}>📊 EQUITY (bán 10%)</div>
                    <div style={{fontSize:".78rem",color:"#aaa",marginBottom:4}}>NĐT sở hữu 10% × $10M =</div>
                    <div style={{fontSize:"1.8rem",fontWeight:900,color:"#00B894"}}>$1,000,000</div>
                    <div style={{fontSize:".72rem",color:"#aaa",marginTop:4}}>Lời <strong style={{color:"#00B894"}}>900%</strong> 🤑</div>
                    <div style={{marginTop:8,background:"rgba(255,255,255,.05)",borderRadius:8,padding:8}}>
                      <div style={{fontSize:".72rem",color:"#aaa"}}>Bạn giữ 90%:</div>
                      <div style={{fontSize:"1.1rem",fontWeight:800,color:"#fff"}}>$9,000,000</div>
                    </div>
                  </Card>
                  <Card bg="rgba(225,112,85,.08)" border="rgba(225,112,85,.3)">
                    <div style={{fontSize:".78rem",fontWeight:700,color:"#E17055",marginBottom:8}}>🏦 DEBT (vay $100K)</div>
                    <div style={{fontSize:".78rem",color:"#aaa",marginBottom:4}}>Trả lại gốc + lãi =</div>
                    <div style={{fontSize:"1.8rem",fontWeight:900,color:"#FDCB6E"}}>$110,000</div>
                    <div style={{fontSize:".72rem",color:"#aaa",marginTop:4}}>Lời chỉ <strong style={{color:"#FDCB6E"}}>10%</strong></div>
                    <div style={{marginTop:8,background:"rgba(255,255,255,.05)",borderRadius:8,padding:8}}>
                      <div style={{fontSize:".72rem",color:"#aaa"}}>Bạn giữ:</div>
                      <div style={{fontSize:"1.1rem",fontWeight:800,color:"#fff"}}>$9,890,000</div>
                    </div>
                  </Card>
                </div>
                <div style={{textAlign:"center",marginTop:12,fontSize:".78rem",color:"#00B894",fontWeight:700}}>
                  ✅ Thành công: Debt có lợi hơn cho Founder! (giữ nhiều hơn $890K)
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <div style={{textAlign:"center",marginBottom:16}}>
                  <span style={{fontSize:"1.5rem"}}>💥</span>
                  <span style={{fontSize:"1.1rem",fontWeight:800,color:"#E17055",marginLeft:8}}>KỊCH BẢN 2: THẤT BẠI — Công ty phá sản, $0</span>
                </div>
                <div style={{display:"flex",gap:16}}>
                  <Card bg="rgba(108,92,231,.08)" border="rgba(108,92,231,.3)">
                    <div style={{fontSize:".78rem",fontWeight:700,color:"#6C5CE7",marginBottom:8}}>📊 EQUITY</div>
                    <div style={{fontSize:".78rem",color:"#aaa",marginBottom:4}}>NĐT mất $100K nhưng...</div>
                    <div style={{fontSize:"1.3rem",fontWeight:900,color:"#00B894",margin:"8px 0"}}>BẠN NỢ: $0</div>
                    <div style={{fontSize:".78rem",color:"#aaa"}}>Equity = chia sẻ rủi ro.<br/>Thất bại thì cùng mất!</div>
                    <div style={{marginTop:8,background:"rgba(0,184,148,.1)",borderRadius:8,padding:"6px 10px"}}>
                      <div style={{fontSize:".78rem",color:"#00B894",fontWeight:700}}>😌 Bạn có thể đứng dậy làm lại</div>
                    </div>
                  </Card>
                  <Card bg="rgba(225,112,85,.08)" border="rgba(225,112,85,.3)">
                    <div style={{fontSize:".78rem",fontWeight:700,color:"#E17055",marginBottom:8}}>🏦 DEBT</div>
                    <div style={{fontSize:".78rem",color:"#aaa",marginBottom:4}}>Công ty chết nhưng...</div>
                    <div style={{fontSize:"1.3rem",fontWeight:900,color:"#E17055",margin:"8px 0"}}>VẪN NỢ: $110,000</div>
                    <div style={{fontSize:".78rem",color:"#aaa"}}>Debt = bạn chịu hết rủi ro.<br/>Phá sản vẫn phải trả!</div>
                    <div style={{marginTop:8,background:"rgba(225,112,85,.1)",borderRadius:8,padding:"6px 10px"}}>
                      <div style={{fontSize:".78rem",color:"#E17055",fontWeight:700}}>😰 Nợ đè, khó khởi nghiệp lại</div>
                    </div>
                  </Card>
                </div>
                <div style={{textAlign:"center",marginTop:12,fontSize:".78rem",color:"#E17055",fontWeight:700}}>
                  ⚠️ Thất bại: Equity an toàn hơn cho Founder!
                </div>
              </div>
            )}

            {step === 4 && (
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:"2.5rem",marginBottom:8}}>💡</div>
                <div style={{fontSize:"1.2rem",fontWeight:800,color:"#fff",marginBottom:14}}>Tóm tắt: Khi nào dùng gì?</div>
                <div style={{display:"flex",gap:16}}>
                  <Card bg="rgba(108,92,231,.08)" border="rgba(108,92,231,.3)">
                    <div style={{fontSize:"1.3rem",fontWeight:800,color:"#6C5CE7",marginBottom:6}}>📊 Equity</div>
                    <div style={{fontSize:".78rem",color:"#aaa",lineHeight:1.6}}>
                      ✅ An toàn khi thất bại<br/>
                      ✅ NĐT giúp mentoring<br/>
                      ❌ Mất quyền kiểm soát<br/>
                      ❌ Chia lợi nhuận mãi mãi
                    </div>
                    <div style={{marginTop:8,fontSize:".72rem",fontWeight:700,color:"#6C5CE7"}}>→ Startup rủi ro cao</div>
                  </Card>
                  <Card bg="rgba(225,112,85,.08)" border="rgba(225,112,85,.3)">
                    <div style={{fontSize:"1.3rem",fontWeight:800,color:"#E17055",marginBottom:6}}>🏦 Debt</div>
                    <div style={{fontSize:".78rem",color:"#aaa",lineHeight:1.6}}>
                      ✅ Giữ 100% ownership<br/>
                      ✅ Trả xong là hết<br/>
                      ❌ Phải trả dù thất bại<br/>
                      ❌ Cần có tài sản đảm bảo
                    </div>
                    <div style={{marginTop:8,fontSize:".72rem",fontWeight:700,color:"#E17055"}}>→ Business ổn định, có cash flow</div>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress */}
        <DemoNav step={step} total={5} setStep={setStep} onClose={onClose} labels={["Setup","Đầu tư","Thành công","Thất bại","Tóm tắt"]} />
      </div>
    </div>
  );
}
