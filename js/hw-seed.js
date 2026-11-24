/* HWLab — dữ liệu mô phỏng thời gian thực thi, cache và công suất */
window.HW_SEED = {
  lab: {
    heading: "Ba phép đo trên một con chip",
    intro: "Tính thời gian thực thi từ số lệnh, CPI và xung nhịp; đo số chu kỳ trung bình khi cache trúng và trượt; ước lượng công suất theo số lõi đang hoạt động. Engine viết tay, kết quả tất định để đối chiếu từng nhiệm vụ.",
    tabs: [
      {
        id: "cpi",
        label: "Thời gian",
        title: "Lệnh, CPI, xung nhịp",
        badge: "giây",
        runLabel: "Tính thời gian",
        hint: "Thời gian = số lệnh × CPI ÷ xung nhịp. Một chương trình một tỉ lệnh, CPI 2, xung 3 GHz mất khoảng 0,67 giây.",
        fields: [
          { id: "instructions", label: "Số lệnh (triệu)", type: "number", min: 100, max: 10000, step: 100, value: 1000 },
          { id: "cpi", label: "CPI (chu kỳ/lệnh)", type: "number", min: 0.5, max: 5, step: 0.5, value: 2 },
          { id: "clockGHz", label: "Xung nhịp (GHz)", type: "number", min: 1, max: 5, step: 0.5, value: 3 }
        ]
      },
      {
        id: "cache",
        label: "Cache",
        title: "Chu kỳ trung bình",
        badge: "chu kỳ",
        runLabel: "Đo cache",
        hint: "Chu kỳ trung bình = thời gian trúng + tỉ lệ trượt × phạt trượt. Tỉ lệ trúng cao nhưng phạt lớn vẫn kéo hiệu năng xuống.",
        fields: [
          { id: "accesses", label: "Số truy cập (triệu)", type: "number", min: 0.1, max: 100, step: 0.1, value: 1 },
          { id: "hitPct", label: "Tỉ lệ trúng (%)", type: "number", min: 0, max: 99, step: 1, value: 90 },
          { id: "hitTime", label: "Trúng cache (chu kỳ)", type: "number", min: 1, max: 10, step: 1, value: 4 },
          { id: "missPenalty", label: "Phạt trượt (chu kỳ)", type: "number", min: 10, max: 300, step: 10, value: 100 }
        ]
      },
      {
        id: "power",
        label: "Công suất",
        title: "Điện năng tiêu thụ",
        badge: "W",
        runLabel: "Ước lượng công suất",
        hint: "Công suất = nền + số lõi × công suất mỗi lõi × tỉ lệ đang chạy. Vượt hạn mức thì phải hạ xung hoặc tắt bớt lõi.",
        fields: [
          { id: "cores", label: "Số lõi", type: "number", min: 2, max: 64, step: 2, value: 16 },
          { id: "wattsPerCore", label: "W mỗi lõi", type: "number", min: 1, max: 30, step: 1, value: 10 },
          { id: "idlePct", label: "Tỉ lệ nhàn rỗi (%)", type: "number", min: 0, max: 80, step: 5, value: 25 },
          { id: "limitW", label: "Hạn mức (W)", type: "number", min: 20, max: 400, step: 10, value: 120 }
        ]
      }
    ],
    defaults: {
      cpi: { instructions: 1000, cpi: 2, clockGHz: 3 },
      cache: { accesses: 1, hitPct: 90, hitTime: 4, missPenalty: 100 },
      power: { cores: 16, wattsPerCore: 10, idlePct: 25, limitW: 120 }
    },
    presets: {
      cpi: [
        { id: "hw-cpi-base", label: "1 tỉ lệnh, CPI 2, 3 GHz", dataset: { instructions: 1000, cpi: 2, clockGHz: 3 } },
        { id: "hw-cpi-fast", label: "4 GHz, CPI 1,5", dataset: { instructions: 1000, cpi: 1.5, clockGHz: 4 } },
        { id: "hw-cpi-slow", label: "CPI 4, xung 2 GHz", dataset: { instructions: 1000, cpi: 4, clockGHz: 2 } }
      ],
      cache: [
        { id: "hw-cache-base", label: "Trúng 90%, phạt 100", dataset: { accesses: 1, hitPct: 90, hitTime: 4, missPenalty: 100 } },
        { id: "hw-cache-good", label: "Trúng 98%, phạt 80", dataset: { accesses: 1, hitPct: 98, hitTime: 4, missPenalty: 80 } },
        { id: "hw-cache-bad", label: "Trúng 60%, phạt 250", dataset: { accesses: 5, hitPct: 60, hitTime: 4, missPenalty: 250 } }
      ],
      power: [
        { id: "hw-power-base", label: "16 lõi, chạy 75%", dataset: { cores: 16, wattsPerCore: 10, idlePct: 25, limitW: 120 } },
        { id: "hw-power-fit", label: "8 lõi, vừa hạn mức", dataset: { cores: 8, wattsPerCore: 10, idlePct: 25, limitW: 120 } },
        { id: "hw-power-hot", label: "32 lõi, vượt hạn", dataset: { cores: 32, wattsPerCore: 15, idlePct: 10, limitW: 200 } }
      ]
    },
    examples: [
      { id: "ex-cpi", kind: "cpi", label: "CPI 4 trên xung 2 GHz", dataset: { instructions: 1000, cpi: 4, clockGHz: 2 } },
      { id: "ex-cache", kind: "cache", label: "Trúng 60%, phạt 250 chu kỳ", dataset: { accesses: 5, hitPct: 60, hitTime: 4, missPenalty: 250 } },
      { id: "ex-power", kind: "power", label: "32 lõi có vượt hạn mức?", dataset: { cores: 32, wattsPerCore: 15, idlePct: 10, limitW: 200 } }
    ],
    missions: [
      {
        id: "m-cpi-time",
        kind: "cpi",
        title: "Thời gian thực thi",
        prompt: "Một tỉ lệnh, CPI 2, xung 3 GHz. Ghi lại thời gian chạy (giây, 2 chữ số thập phân).",
        metric: "timeSeconds",
        expect: 0.67,
        hint: "1.000 triệu × 2 ÷ 3.000 triệu = 0,667 → 0,67 giây.",
        dataset: { instructions: 1000, cpi: 2, clockGHz: 3 }
      },
      {
        id: "m-cpi-ok",
        kind: "cpi",
        title: "Dưới một giây",
        prompt: "Một tỉ lệnh, CPI 2, xung 3 GHz, hạn 1 giây. Engine phải kết luận đạt.",
        metric: "ok",
        expect: 1,
        hint: "0,667 giây nhỏ hơn 1 giây.",
        dataset: { instructions: 1000, cpi: 2, clockGHz: 3 }
      },
      {
        id: "m-cache-avg",
        kind: "cache",
        title: "Chu kỳ trung bình",
        prompt: "Trúng cache 90%, trúng 4 chu kỳ, trượt phạt 100 chu kỳ. Ghi lại số chu kỳ trung bình mỗi truy cập.",
        metric: "avgCycles",
        expect: 14,
        hint: "4 + 0,1 × 100 = 14 chu kỳ.",
        dataset: { accesses: 1, hitPct: 90, hitTime: 4, missPenalty: 100 }
      },
      {
        id: "m-cache-ok",
        kind: "cache",
        title: "Cache đạt ngưỡng",
        prompt: "Vẫn cấu hình 90%/4/100. Engine phải kết luận trung bình dưới 20 chu kỳ.",
        metric: "ok",
        expect: 1,
        hint: "14 chu kỳ, dưới ngưỡng 20.",
        dataset: { accesses: 1, hitPct: 90, hitTime: 4, missPenalty: 100 }
      },
      {
        id: "m-power-watts",
        kind: "power",
        title: "Công suất mười sáu lõi",
        prompt: "16 lõi, 10 W mỗi lõi, nhàn rỗi 25%. Ghi lại công suất tiêu thụ (W).",
        metric: "watts",
        expect: 140,
        hint: "16 × 10 × 0,75 = 120 W hoạt động, cộng nền 20 W = 140 W.",
        dataset: { cores: 16, wattsPerCore: 10, idlePct: 25, limitW: 120 }
      },
      {
        id: "m-power-ok",
        kind: "power",
        title: "Vượt hạn mức",
        prompt: "16 lõi, 10 W mỗi lõi, nhàn rỗi 25%, hạn 120 W. Engine phải kết luận vượt hạn.",
        metric: "ok",
        expect: 0,
        hint: "140 W lớn hơn hạn 120 W.",
        dataset: { cores: 16, wattsPerCore: 10, idlePct: 25, limitW: 120 }
      }
    ]
  }
};

window.HW_SEED.home = {
  "title": "HWLab — Phần cứng máy tính, nhìn thấy từng bước",
  "eyebrow": "Khóa học tương tác · 12 bài · tiếng Việt",
  "h1": "Một con chip.<br><span class=\"hl\">Thấy</span> cả hiệu năng.",
  "sub": "Đi từ CPU, thanh ghi, cache, bộ nhớ đến bus, ổ đĩa và hệ thống nhúng. Mỗi bài là <strong>một sơ đồ sống</strong>, còn phòng mô phỏng tính thời gian thực thi, chu kỳ cache và công suất ngay trong trình duyệt — không cần cài đặt.",
  "note": "Không backend. Số liệu mô phỏng và tiến độ nằm trên máy bạn.",
  "startLabel": "Bắt đầu bài 01",
  "labLabel": "Mở phòng mô phỏng",
  "modesHead": "Bốn cách học, một đường ống lệnh",
  "modesSub": "Không chỉ đọc thông số. Bạn xem một lệnh đi từ bộ nhớ, qua các tầng cache, vào CPU rồi ghi kết quả, kèm phép đo cụ thể để đối chiếu.",
  "modes": [
    {
      "title": "Học bằng sơ đồ sống",
      "desc": "Từng khối chức năng, đường dữ liệu và điểm nghẽn hiện ra theo bước, kèm một cấu hình máy cụ thể để đối chiếu.",
      "href": "#/learn",
      "icon": "process",
      "tone": "blue",
      "cta": "Vào lớp học"
    },
    {
      "title": "Luyện tập tình huống",
      "desc": "8 ca thường gặp: CPI cao, cache trượt nhiều, nghẽn bus và vượt hạn mức điện.",
      "href": "#/practice",
      "icon": "star",
      "tone": "coral",
      "cta": "Bắt đầu luyện"
    },
    {
      "title": "Phòng mô phỏng",
      "desc": "Tính thời gian thực thi, chu kỳ trung bình của cache và công suất theo số lõi, kèm 6 nhiệm vụ.",
      "href": "#/lab",
      "icon": "gateway",
      "tone": "violet",
      "cta": "Mở phòng mô phỏng"
    },
    {
      "title": "Cheatsheets",
      "desc": "Bảng công thức CPI, sơ đồ cache, bảng công suất và checklist chọn cấu hình — tra nhanh.",
      "href": "#/cheatsheets",
      "icon": "file",
      "tone": "green",
      "cta": "Mở bảng tra"
    }
  ],
  "outlineHead": "Lộ trình 12 bài",
  "outlineSub": "Từ cổng logic đến hạn mức điện: mỗi module trả lời một câu hỏi lớn của phần cứng.",
  "faq": [
    {
      "q": "Đây có phải trình mô phỏng CPU thật?",
      "a": "Không. Đây là mô phỏng viết tay cho khóa học: tính thời gian, chu kỳ cache và công suất trên số liệu cố định. Đủ để thấy vì sao một cấu hình nhanh hoặc tốn điện — không thay thế gem5, một bo mạch thật hay phòng thí nghiệm."
    },
    {
      "q": "Vì sao số liệu mẫu cố định?",
      "a": "Dữ liệu cố định để kết quả tất định và dễ đối chiếu: một tỉ lệnh, CPI 2, xung 3 GHz, cache trúng 90%. Nhờ vậy nhiệm vụ có đáp án kiểm chứng được."
    },
    {
      "q": "Có cần biết điện tử trước không?",
      "a": "Không bắt buộc. Bài học giải thích bằng sơ đồ khối và ví dụ; công thức và bảng thông số nằm ở cheatsheet để tra khi cần."
    },
    {
      "q": "Dùng trên điện thoại hoặc máy chiếu được không?",
      "a": "Được. Giao diện responsive, thanh bên chuyển thành drawer và sơ đồ cuộn ngang trên màn hình nhỏ. Bảng kết quả vẫn đọc được; nên xoay ngang khi xem nhiều cột."
    }
  ],
  "letter": "H",
  "brand": "HWLab",
  "hero": {
    "bar": "hw://cpu/pipeline",
    "title": "lấy lệnh · giải mã · thực thi · ghi",
    "aria": "Một lệnh đi qua các tầng của đường ống CPU rồi ghi kết quả",
    "states": [
      {
        "label": "Lấy lệnh"
      },
      {
        "label": "Giải mã"
      },
      {
        "label": "Thực thi"
      },
      {
        "label": "Ghi"
      }
    ],
    "final": "OK",
    "queueSmall": "Kết quả",
    "queueChip": "0,67 s",
    "queueVerdict": "1 tỉ lệnh",
    "frames": [
      {
        "small": "CPI",
        "b": "2,0"
      },
      {
        "small": "Cache",
        "b": "14 chu kỳ",
        "cls": "hit"
      },
      {
        "small": "Công suất",
        "b": "140 W",
        "cls": "miss"
      }
    ]
  },
  "promo": {
    "eyebrow": "Phòng mô phỏng · chạy cục bộ",
    "h2": "Một con chip.<br>Ba phép đo.",
    "p": "Tính thời gian thực thi từ số lệnh, CPI và xung nhịp; đo chu kỳ trung bình khi cache trúng và trượt; ước lượng công suất theo số lõi đang chạy. Sáu nhiệm vụ chấm điểm ngay trên kết quả.",
    "cta": "Mở phòng mô phỏng",
    "nodes": [
      {
        "icon": "server",
        "label": "CPU",
        "sub": "16 lõi",
        "hot": true
      },
      {
        "icon": "memory",
        "label": "RAM",
        "sub": "dùng chung"
      },
      {
        "icon": "layers",
        "label": "Cache",
        "sub": "trúng 90%"
      },
      {
        "icon": "bolt",
        "label": "Xung nhịp",
        "sub": "3 GHz",
        "hot": true
      },
      {
        "icon": "clock",
        "label": "Chu kỳ",
        "sub": "CPI 2"
      },
      {
        "icon": "disk",
        "label": "Ổ đĩa",
        "sub": "lưu trữ"
      },
      {
        "icon": "check",
        "label": "Ổn định",
        "sub": "trong hạn"
      }
    ]
  }
};
window.HWLAB = window.HWLAB || { modules: [], lessons: {}, practice: [], cheatsheets: [] };
window.HWLAB.home = window.HW_SEED.home;

(function () {
  const D = window.HWLAB;
  if (!D) return;
  Object.values(D.lessons || {}).forEach((lesson) => {
    (lesson.steps || []).forEach((step) => {
      if (Array.isArray(step.metrics)) {
        const keyed = {};
        step.metrics.forEach((m) => { if (m && m.key != null) keyed[m.key] = m.value; });
        step.metrics = keyed;
      }
      if (Array.isArray(step.changes)) {
        step.changes = step.changes.map((c) => {
          if (!c || typeof c !== "object") return String(c);
          if (c.before && c.after) return c.label + ": " + c.before + " thành " + c.after;
          return String(c.label || c.after || "");
        });
      }
    });
  });
  (D.cheatsheets || []).forEach((sheet) => {
    (sheet.cards || []).forEach((card) => { if (!card.html && card.body) card.html = card.body; });
  });
})();

(function () {
  const D = window.HWLAB;
  if (!D) return;
  D.practice.push(
    {
      id: "hw-practice-pipeline",
      kind: "pipeline",
      module: "hieu-nang",
      tag: "PIPELINE",
      title: "Đường ống năm tầng có rẽ nhánh",
      scenario: "Bộ xử lý có đường ống 5 tầng, mỗi tầng một chu kỳ. Với chuỗi lệnh không rẽ nhánh, 100 lệnh cần 104 chu kỳ, tức gần 4,8 lần so với chạy tuần tự. Khi thêm 20% lệnh rẽ nhánh, thời gian tăng rõ rệt. Nhóm muốn giải thích vì sao tăng tốc thực tế thấp hơn số tầng. Hãy chọn kết luận đúng nhất.",
      metrics: [
        { label: "Số tầng", value: "5" },
        { label: "Lệnh rẽ nhánh", value: "20%" },
        { label: "Chu kỳ cho 100 lệnh", value: "104" }
      ],
      options: [
        "Rẽ nhánh làm đường ống phải xả và nạp lại, nên tăng tốc thực tế thấp hơn 5 lần",
        "Đường ống 5 tầng luôn cho đúng 5 lần bất kể chương trình",
        "Thêm tầng sẽ luôn tăng tốc tuyến tính vì mỗi tầng một chu kỳ",
        "Rẽ nhánh không ảnh hưởng vì các tầng vẫn chạy song song"
      ],
      correct: 0,
      explain: "Khi gặp lệnh rẽ nhánh, các lệnh đã nạp sau đó có thể sai và phải xả khỏi đường ống, tạo khoảng trống chu kỳ. Vì vậy 100 lệnh cần 104 chu kỳ thay vì gần 100, và tăng tốc thực tế thấp hơn số tầng. Thêm tầng chỉ có lợi khi ít rẽ nhánh và ít hazard; không có chuyện tăng tốc tuyến tính vô điều kiện."
    },
    {
      id: "hw-practice-firmware",
      kind: "firmware",
      module: "he-thong-nhung",
      tag: "FIRMWARE",
      title: "Cập nhật phần sủng qua mạng",
      scenario: "Thiết bị đo môi trường dùng vi điều khiển có 512 KB flash, hiện đã dùng 78%. Bản cập nhật mới nặng 240 KB và cần ghi đè an toàn, không được để thiết bị chết giữa chừng. Nhóm phát triển muốn gửi cập nhật qua mạng tới các trạm ở xa. Hãy chọn phương án cập nhật hợp lý nhất.",
      metrics: [
        { label: "Flash", value: "512 KB" },
        { label: "Đã dùng", value: "78%" },
        { label: "Gói cập nhật", value: "240 KB" }
      ],
      options: [
        "Dùng hai vùng flash A/B, ghi bản mới vào vùng trống rồi chuyển khởi động khi kiểm tra chữ ký đạt",
        "Ghi đè trực tiếp lên bản đang chạy để tiết kiệm chỗ",
        "Nén gói cập nhật xuống dưới 100 KB là đủ, không cần vùng dự phòng",
        "Tắt kiểm tra chữ ký để cập nhật nhanh hơn"
      ],
      correct: 0,
      explain: "Flash còn khoảng 112 KB, không đủ chứa gói 240 KB nếu ghi đè trực tiếp, và ghi đè bản đang chạy có thể làm thiết bị hỏng nếu mất điện. Cách an toàn là bố trí hai vùng A/B, ghi bản mới vào vùng còn trống, kiểm tra chữ ký rồi mới chuyển khởi động. Bỏ kiểm tra chữ ký mở đường cho firmware giả hoặc lỗi truyền."
    }
  );
})();
