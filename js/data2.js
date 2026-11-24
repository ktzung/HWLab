/* HWLab — phần 2: module hiệu năng, bốn bài học, tình huống và bảng tra */
window.HWLAB = window.HWLAB || { modules: [], lessons: {}, practice: [], cheatsheets: [] };
(function () {
  const T = window.HWLAB;
  T.modules = T.modules || [];
  T.lessons = T.lessons || {};
  T.practice = T.practice || [];
  T.cheatsheets = T.cheatsheets || [];

  T.modules.push({
    id: "hieu-nang",
    num: "02",
    tone: "mint",
    title: "Hiệu năng",
    blurb: "Bốn bài nối thành một cách đo hiệu năng có cơ sở: tính thời gian từ số lệnh, CPI và xung nhịp, quy đổi cache trúng trượt ra chu kỳ trung bình, thấy ống lệnh mất tốc vì rẽ nhánh, và ước lượng công suất để không vượt hạn nguồn.",
    lessons: ["cpi", "cache", "pipeline", "power"]
  });

  T.lessons["cpi"] = {
    id: "cpi",
    module: "hieu-nang",
    title: "CPI và thời gian",
    shortTitle: "CPI",
    subtitle: "Ba con số quyết định thời gian chạy",
    blurb: "Chương trình một tỉ lệnh chạy trên lõi CPI 2 và xung 3 GHz mất 0,67 giây, dưới hạn một giây. Bài tách công thức thành ba thừa số, chỉ chỗ CPI bị kéo lên và cách đo trước khi hứa mốc thời gian.",
    duration: "12 phút",
    level: "Cơ bản",
    tags: ["CPI", "xung nhịp", "số lệnh", "thời gian chạy", "đo hiệu năng"],
    metrics: [
      { key: "instructions", label: "Số lệnh", tone: "blue" },
      { key: "cpi", label: "CPI", tone: "mint" },
      { key: "timeSeconds", label: "Thời gian", tone: "yellow" },
      { key: "ok", label: "So hạn 1 giây", tone: "coral" }
    ],
    nodes: [
      { id: "app", type: "task", x: 55, y: 80, w: 200, h: 70, label: "Ứng dụng", sub: "1 tỉ lệnh" },
      { id: "core", type: "grid", x: 340, y: 80, w: 200, h: 70, label: "Lõi CPU", sub: "CPI trung bình 2" },
      { id: "clk", type: "clock", x: 625, y: 80, w: 200, h: 70, label: "Xung 3 GHz", sub: "3 tỉ chu kỳ mỗi giây" },
      { id: "cyc", type: "layers", x: 55, y: 310, w: 200, h: 70, label: "Số chu kỳ", sub: "2 tỉ chu kỳ" },
      { id: "time", type: "event", x: 340, y: 310, w: 200, h: 70, label: "Thời gian chạy", sub: "2 tỉ chia 3 tỉ" },
      { id: "gate", type: "check", x: 625, y: 310, w: 200, h: 70, label: "Hạn 1 giây", sub: "0,67 giây: đạt" },
      { id: "slow", type: "alert", x: 340, y: 195, w: 200, h: 70, label: "Nút thắt CPI", sub: "chờ dữ liệu, rẽ nhánh" }
    ],
    edges: [
      { id: "app-core", from: "app", to: "core", kind: "request", label: "1 tỉ lệnh" },
      { id: "core-clk", from: "core", to: "clk", kind: "control", label: "hỏi xung nhịp" },
      { id: "core-cyc", from: "core", to: "cyc", kind: "data", label: "nhân với CPI" },
      { id: "cyc-time", from: "cyc", to: "time", kind: "data", label: "chia xung" },
      { id: "time-gate", from: "time", to: "gate", kind: "data", label: "0,67 giây" },
      { id: "gate-app", from: "gate", to: "app", kind: "response", label: "đạt hạn 1 giây" },
      { id: "slow-core", from: "slow", to: "core", kind: "control", label: "kéo CPI lên" }
    ],
    learn: [
      "Thời gian chạy bằng số lệnh nhân CPI rồi chia xung nhịp.",
      "Một tỉ lệnh, CPI 2, xung 3 GHz cho <code>0,67 giây</code>.",
      "Xung tính bằng chu kỳ mỗi giây: 3 GHz là ba tỉ chu kỳ.",
      "CPI thực tế cao hơn lý thuyết vì cache trượt và rẽ nhánh."
    ],
    steps: [
      {
        short: "Ba thừa số",
        type: "concept",
        title: "Thời gian chạy có ba thừa số",
        body: "Thời gian chạy của một chương trình bắt nguồn từ ba con số: số lệnh, số chu kỳ trung bình cho mỗi lệnh và xung nhịp. Công thức gọn là <code>T = IC × CPI ÷ f</code>, với IC là số lệnh, CPI là chu kỳ mỗi lệnh, f là xung nhịp tính bằng hertz. Chương trình một tỉ lệnh, CPI 2, xung 3 GHz cho hai tỉ chu kỳ, chia cho ba tỉ chu kỳ mỗi giây. Kết quả là 0,67 giây, nằm dưới hạn một giây. Điều đáng chú ý là ba thừa số không độc lập: tăng xung thường kéo CPI lên vì bộ nhớ không nhanh theo, còn giảm số lệnh nhờ thuật toán tốt hơn thì gần như không phải đánh đổi.",
        focus: ["app", "core", "cyc", "clk"],
        edges: ["app-core", "core-clk", "core-cyc"],
        metrics: { instructions: "1 tỉ", cpi: "2,0", timeSeconds: "0,67 s", ok: "đạt" },
        changes: [
          "Ba đại lượng được tách riêng thay vì gộp thành một chỉ số mơ hồ.",
          "Hạn một giây trở thành mốc so sánh thay vì cảm nhận chủ quan."
        ],
        note: "CPI là trung bình có trọng số theo loại lệnh, không phải hằng số của chip."
      },
      {
        short: "Ra chu kỳ",
        type: "flow",
        title: "Từ số lệnh ra số chu kỳ",
        body: "Bước thứ hai là đổi số lệnh sang số chu kỳ. Mỗi lệnh cần trung bình 2 chu kỳ, nên một tỉ lệnh cần hai tỉ chu kỳ. Con số CPI 2 này là trung bình của cả chương trình: lệnh số học có thể xong trong một chu kỳ, lệnh nạp từ bộ nhớ có thể giữ lõi hàng chục chu kỳ. Nếu chương trình có 60% lệnh số học CPI 1 và 40% lệnh nạp CPI 3,5 thì CPI trung bình là <code>0,6 × 1 + 0,4 × 3,5 = 2,0</code>. Vì vậy đổi cấu trúc dữ liệu để ít lệnh nạp hơn có thể hạ CPI mà không cần đổi chip.",
        focus: ["app", "core", "cyc"],
        edges: ["app-core", "core-cyc"],
        metrics: { instructions: "1 tỉ", cpi: "2,0", timeSeconds: "0,67 s", ok: "đạt" },
        changes: [
          "Số chu kỳ hiện ra rõ: hai tỉ chu kỳ cho một tỉ lệnh.",
          "CPI được nhìn như trung bình có trọng số theo tỉ lệ loại lệnh."
        ],
        note: "Muốn hạ CPI thì phải biết loại lệnh nào đang chiếm nhiều chu kỳ nhất."
      },
      {
        short: "Chia xung",
        type: "detail",
        title: "Chia cho xung nhịp 3 GHz",
        body: "Bước cuối là chia số chu kỳ cho xung nhịp. Xung 3 GHz nghĩa là ba tỉ chu kỳ mỗi giây, mỗi chu kỳ dài khoảng 0,33 nanôgiây. Hai tỉ chu kỳ chia ba tỉ chu kỳ mỗi giây cho <code>0,667 giây</code>, làm tròn 0,67 giây. So với hạn một giây, chương trình còn dư 0,33 giây, tức biên khoảng 33%. Biên này không phải chỗ để tiêu: cùng một tỉ lệnh, nếu CPI thực đo là 3 thay vì 2 thì thời gian thành 1,0 giây, vừa chạm hạn và mất sạch phần dư. Vì vậy khi báo cáo, hãy ghi cả ba con số thay vì chỉ ghi mốc thời gian đẹp.",
        focus: ["cyc", "time", "clk", "gate"],
        edges: ["core-clk", "cyc-time", "time-gate"],
        metrics: { instructions: "1 tỉ", cpi: "2,0", timeSeconds: "0,67 s", ok: "đạt" },
        changes: [
          "Thời gian ra đúng 0,67 giây, còn dư 0,33 giây so với hạn.",
          "Mỗi chu kỳ được quy ra 0,33 nanôgiây để dễ đối chiếu độ trễ bộ nhớ."
        ],
        note: "Đổi GHz sang chu kỳ mỗi giây trước khi chia để tránh sai đơn vị."
      },
      {
        short: "CPI trôi",
        type: "pitfall",
        title: "CPI không đứng yên",
        body: "Sai lầm phổ biến là lấy CPI lý thuyết 1,0 của kiến trúc rồi hứa thời gian chạy. CPI thực tế bị kéo lên bởi cache trượt, rẽ nhánh đoán sai, tranh chấp bộ nhớ và cả tần số tụt khi chip nóng. Với chương trình một tỉ lệnh và xung 3 GHz, CPI 3 cho đúng 1,0 giây, CPI 3,5 cho 1,17 giây, vượt hạn 17%. Chỉ cần ba lần trượt cache nặng mỗi nghìn lệnh là đủ đẩy CPI lên mức đó. Cách làm đúng là đo trên máy thật bằng bộ đếm hiệu năng, ghi lại cả xung nhịp trung bình trong lúc chạy, rồi cộng thêm biên dự phòng 20 đến 30% trước khi cam kết.",
        focus: ["slow", "core", "time"],
        edges: ["slow-core", "core-cyc", "cyc-time"],
        metrics: { instructions: "1 tỉ", cpi: "3,5", timeSeconds: "1,17 s", ok: "vượt hạn" },
        changes: [
          "CPI chuyển từ giả định 2,0 sang 3,5 khi tính cả trượt cache.",
          "Thời gian vượt hạn: 1,17 giây thay vì 0,67 giây."
        ],
        note: "Đo CPI theo từng giai đoạn của chương trình sẽ thấy chỗ tệ nhất."
      },
      {
        short: "Chốt cách đo",
        type: "final",
        title: "Đo ba con số trước khi hứa",
        tone: "final",
        body: "Chốt lại quy trình gọn. Một: đếm số lệnh bằng bộ đếm phần cứng, không ước lượng bằng số dòng mã. Hai: đo CPI trung bình trên đúng cấu hình chạy thật, ghi cả xung nhịp hiệu dụng vì chip có thể tụt tần số. Ba: tính <code>T = IC × CPI ÷ f</code> và so với hạn, giữ biên ít nhất 20%. Bốn: nếu vượt hạn, thử theo thứ tự rẻ nhất, giảm số lệnh bằng thuật toán, rồi hạ CPI bằng cách cải thiện truy cập bộ nhớ, cuối cùng mới nâng xung. Năm: ghi lại cả ba con số trong tài liệu để lần sau đối chiếu. Với ví dụ trong bài, 0,67 giây trên hạn một giây là kết quả đạt, nhưng chỉ còn biên 33%.",
        focus: "all",
        edges: "all",
        metrics: { instructions: "1 tỉ", cpi: "2,0", timeSeconds: "0,67 s", ok: "đạt, biên 33%" },
        changes: [
          "Báo cáo hiệu năng có đủ số lệnh, CPI đo được và xung hiệu dụng.",
          "Thứ tự tối ưu được cố định: giảm lệnh, hạ CPI, rồi mới nâng xung."
        ],
        note: "Nâng xung là cách đắt nhất và thường bị chặn bởi công suất."
      }
    ]
  };

  T.lessons["cache"] = {
    id: "cache",
    module: "hieu-nang",
    title: "Cache trúng và trượt",
    shortTitle: "Cache",
    subtitle: "Vì sao 90% trúng vẫn chậm",
    blurb: "Trúng 90% nghe rất tốt, nhưng với phạt trượt 100 chu kỳ, mỗi truy cập vẫn tốn 14 chu kỳ. Bài này tính chi phí trung bình, so hai cách giảm chu kỳ và chỉ ra ngưỡng nào mới thật sự đáng tiền.",
    duration: "12 phút",
    level: "Cơ bản",
    tags: ["cache", "tỉ lệ trúng", "phạt trượt", "L1", "chu kỳ trung bình"],
    metrics: [
      { key: "hitPct", label: "Tỉ lệ trúng", tone: "mint" },
      { key: "hitTime", label: "Trúng", tone: "blue" },
      { key: "avgCycles", label: "Chu kỳ trung bình", tone: "yellow" },
      { key: "ok", label: "So mục tiêu 10", tone: "coral" }
    ],
    nodes: [
      { id: "cpu", type: "task", x: 55, y: 80, w: 200, h: 70, label: "Lõi CPU", sub: "1 triệu truy cập" },
      { id: "l1", type: "memory", x: 340, y: 80, w: 200, h: 70, label: "Cache L1", sub: "trúng 4 chu kỳ" },
      { id: "ram", type: "disk", x: 625, y: 80, w: 200, h: 70, label: "Bộ nhớ chính", sub: "trượt 100 chu kỳ" },
      { id: "hit", type: "check", x: 55, y: 310, w: 200, h: 70, label: "Nhánh trúng", sub: "90% truy cập" },
      { id: "miss", type: "alert", x: 625, y: 310, w: 200, h: 70, label: "Nhánh trượt", sub: "10% truy cập" },
      { id: "avg", type: "star", x: 340, y: 310, w: 200, h: 70, label: "Chu kỳ trung bình", sub: "4 + 0,1 × 100" },
      { id: "target", type: "clock", x: 340, y: 195, w: 200, h: 70, label: "Mục tiêu 10 chu kỳ", sub: "đang 14, còn 4" }
    ],
    edges: [
      { id: "cpu-l1", from: "cpu", to: "l1", kind: "request", label: "đọc dữ liệu" },
      { id: "l1-hit", from: "l1", to: "hit", kind: "data", label: "trúng, 4 chu kỳ" },
      { id: "l1-ram", from: "l1", to: "ram", kind: "control", label: "trượt, nạp khối" },
      { id: "ram-miss", from: "ram", to: "miss", kind: "data", label: "trả về CPU" },
      { id: "hit-avg", from: "hit", to: "avg", kind: "data", label: "0,9 × 4" },
      { id: "miss-avg", from: "miss", to: "avg", kind: "data", label: "0,1 × 100" },
      { id: "avg-target", from: "avg", to: "target", kind: "data", label: "vượt 4 chu kỳ" }
    ],
    learn: [
      "Chu kỳ trung bình bằng thời gian trúng cộng tỉ lệ trượt nhân phạt trượt.",
      "Trúng 90%, trúng 4 chu kỳ, phạt 100 cho <code>14 chu kỳ</code>.",
      "Chỉ 10% trượt nhưng chiếm 10 trên 14 chu kỳ trung bình.",
      "Giảm phạt trượt thường rẻ hơn tăng tỉ lệ trúng vài điểm."
    ],
    steps: [
      {
        short: "Công thức",
        type: "concept",
        title: "Một công thức, hai nhánh",
        body: "Mỗi lần CPU đọc dữ liệu, nó hỏi cache trước. Nếu có, đó là trúng, mất 4 chu kỳ. Nếu không, đó là trượt, phải xuống bộ nhớ chính và mất 100 chu kỳ. Chi phí trung bình mỗi truy cập là <code>4 + 0,1 × 100 = 14 chu kỳ</code>. Công thức chung là thời gian trúng cộng tỉ lệ trượt nhân phạt trượt. Điểm dễ bỏ qua là phạt trượt được nhân với phần nhỏ, nhưng phần nhỏ ấy lại chiếm phần lớn thời gian: 10 chu kỳ đến từ 10% lần trượt, chỉ 4 chu kỳ đến từ 90% lần trúng. Vì vậy tối ưu cache phải nhìn cả hai thừa số.",
        focus: ["cpu", "l1", "hit", "miss"],
        edges: ["cpu-l1", "l1-hit", "ram-miss"],
        metrics: { hitPct: "90%", hitTime: "4", avgCycles: "14", ok: "vượt mục tiêu" },
        changes: [
          "Mỗi truy cập được quy ra 14 chu kỳ thay vì cảm giác nhanh chậm.",
          "Phần đóng góp của nhánh trượt được tách khỏi nhánh trúng."
        ],
        note: "Phạt trượt tính bằng chu kỳ, nên nó phụ thuộc cả độ trễ bộ nhớ lẫn xung nhịp."
      },
      {
        short: "Một triệu lần",
        type: "flow",
        title: "Một triệu truy cập tốn bao nhiêu",
        body: "Với một triệu truy cập và 14 chu kỳ mỗi lần, tổng là 14 triệu chu kỳ. Ở xung 3 GHz, con số đó là khoảng 4,7 miligiây. Nhìn theo nhánh: 900.000 lần trúng nhân 4 chu kỳ là 3,6 triệu chu kỳ; 100.000 lần trượt nhân 100 chu kỳ là 10 triệu chu kỳ. Một phần mười số truy cập chiếm gần ba phần tư thời gian. Đây là lý do các bài đo hiệu năng luôn hỏi tỉ lệ trượt trước khi hỏi tỉ lệ trúng, vì 5 điểm phần trăm trượt ít hơn có thể đổi lấy hàng chục chu kỳ. Nếu vòng lặp chạy 100 triệu lần, chi phí thành 470 miligiây, đủ để người dùng thấy chậm.",
        focus: ["cpu", "hit", "miss", "avg"],
        edges: ["hit-avg", "miss-avg", "ram-miss"],
        metrics: { hitPct: "90%", hitTime: "4", avgCycles: "14", ok: "vượt mục tiêu" },
        changes: [
          "Tổng chi phí hiện ra: 14 triệu chu kỳ, khoảng 4,7 miligiây.",
          "Nhánh trượt được xác định là nơi chiếm 10 trên 14 chu kỳ."
        ],
        note: "Tính bằng chu kỳ trước, đổi sang miligiây sau, sẽ tránh nhầm đơn vị."
      },
      {
        short: "Tăng trúng",
        type: "detail",
        title: "Tăng tỉ lệ trúng lên 95%",
        body: "Cách đầu tiên là làm cache trúng nhiều hơn, ví dụ nới kích thước L1 từ 32 lên 64 kilobyte hoặc sắp xếp lại dữ liệu cho thân thiện bộ nhớ. Tỉ lệ trúng lên 95% đưa chi phí trung bình về <code>4 + 0,05 × 100 = 9 chu kỳ</code>, tức 9 triệu chu kỳ cho một triệu truy cập, khoảng 3 miligiây. Kết quả đã dưới mục tiêu 10 chu kỳ, nhưng phần trượt vẫn chiếm 5 trên 9 chu kỳ. Nếu sau đó dữ liệu phình to gấp đôi, tỉ lệ trúng có thể rơi lại 88% và chi phí nhảy lên 16 chu kỳ. Vì vậy tăng tỉ lệ trúng là cách tốt nhưng mong manh trước thay đổi kích thước dữ liệu.",
        focus: ["l1", "hit", "avg", "target"],
        edges: ["l1-hit", "hit-avg", "avg-target"],
        metrics: { hitPct: "95%", hitTime: "4", avgCycles: "9", ok: "đạt" },
        changes: [
          "Chu kỳ trung bình giảm từ 14 xuống 9, dưới mục tiêu 10.",
          "Phần trượt vẫn chiếm 5 trên 9 chu kỳ, chưa phải điểm an toàn."
        ],
        note: "Tỉ lệ trúng phụ thuộc kích thước dữ liệu, nên phải đo lại khi dữ liệu lớn dần."
      },
      {
        short: "Giảm phạt",
        type: "pitfall",
        title: "Giảm phạt trượt và cái bẫy L2",
        body: "Cách thứ hai là giảm phạt trượt, ví dụ thêm cache L2 và nạp trước dữ liệu để phạt từ 100 xuống 40 chu kỳ. Giữ tỉ lệ trúng 90%, chi phí thành <code>4 + 0,1 × 40 = 8 chu kỳ</code>. Nhưng có bẫy: thêm một tầng tra cứu làm lần trúng chậm đi, từ 4 lên 5 chu kỳ, và khi đó chi phí là 5 cộng 4, tức 9 chu kỳ, gần như hòa vốn. Nếu nạp trước sai địa chỉ, băng thông bộ nhớ bị chiếm và phạt trượt lại tăng. Hãy đo cả bốn số: tỉ lệ trúng, thời gian trúng, phạt trượt và băng thông, thay vì chỉ nhìn một chỉ số đẹp.",
        focus: ["l1", "ram", "miss", "avg"],
        edges: ["l1-ram", "ram-miss", "miss-avg"],
        metrics: { hitPct: "90%", hitTime: "4", avgCycles: "8", ok: "đạt" },
        changes: [
          "Phạt trượt giảm từ 100 xuống 40 chu kỳ, trung bình còn 8 chu kỳ.",
          "Chi phí tra cứu tầng thêm được tính vào thời gian trúng."
        ],
        note: "Giảm phạt trượt mà tăng thời gian trúng thì lợi ích có thể bằng không."
      },
      {
        short: "Chốt hai đòn",
        type: "final",
        title: "Kết hợp cả hai mới bền",
        tone: "final",
        body: "Chốt lại cách làm đủ và bền. Một: đo tỉ lệ trúng, thời gian trúng và phạt trượt trên dữ liệu thật, không dùng số của bài mẫu. Hai: tính chu kỳ trung bình, rồi quy ra miligiây cho một triệu truy cập. Ba: tấn công cả hai phía, tăng tỉ lệ trúng lên 95% và giảm phạt trượt xuống 40 chu kỳ, cho <code>4 + 0,05 × 40 = 6 chu kỳ</code>. Bốn: kiểm tra lại khi dữ liệu tăng gấp đôi, vì tỉ lệ trúng thường tụt. Năm: đặt ngưỡng cảnh báo để phát hiện sớm. Kết quả 6 chu kỳ, tức khoảng 2 miligiây cho một triệu truy cập, có biên 4 chu kỳ so với mục tiêu.",
        focus: "all",
        edges: "all",
        metrics: { hitPct: "95%", hitTime: "4", avgCycles: "6", ok: "đạt, biên 4" },
        changes: [
          "Hai đòn cùng lúc đưa chi phí từ 14 xuống 6 chu kỳ mỗi truy cập.",
          "Có ngưỡng cảnh báo cho tỉ lệ trượt khi dữ liệu tăng kích thước."
        ],
        note: "Mục tiêu 10 chu kỳ chỉ có nghĩa khi đi kèm kích thước dữ liệu cụ thể."
      }
    ]
  };

  T.lessons["pipeline"] = {
    id: "pipeline",
    module: "hieu-nang",
    title: "Đường ống lệnh",
    shortTitle: "Ống lệnh",
    subtitle: "Năm tầng và cái giá của rẽ nhánh",
    blurb: "Năm tầng giúp lõi gần như xong một lệnh mỗi chu kỳ, nhưng rẽ nhánh và hazard dữ liệu lấy lại phần lớn lợi ích. Bài tính tăng tốc lý thuyết 5 lần, rồi hạ xuống 3,6 lần khi 20% lệnh là rẽ nhánh.",
    duration: "12 phút",
    level: "Trung cấp",
    tags: ["pipeline", "rẽ nhánh", "hazard", "CPI", "tăng tốc"],
    metrics: [
      { key: "stages", label: "Số tầng", tone: "blue" },
      { key: "idealSpeedup", label: "Tăng tốc lý thuyết", tone: "mint" },
      { key: "stallPct", label: "Chu kỳ mất", tone: "yellow" },
      { key: "ok", label: "Tăng tốc thực", tone: "coral" }
    ],
    nodes: [
      { id: "if", type: "queue", x: 55, y: 80, w: 200, h: 70, label: "Nạp lệnh", sub: "1 lệnh mỗi chu kỳ" },
      { id: "id", type: "code", x: 340, y: 80, w: 200, h: 70, label: "Giải mã", sub: "đọc thanh ghi" },
      { id: "ex", type: "bolt", x: 625, y: 80, w: 200, h: 70, label: "Thực thi", sub: "ALU và bộ nhân" },
      { id: "mem", type: "memory", x: 55, y: 310, w: 200, h: 70, label: "Truy cập bộ nhớ", sub: "đọc ghi cache" },
      { id: "wb", type: "check", x: 340, y: 310, w: 200, h: 70, label: "Ghi lại", sub: "cập nhật thanh ghi" },
      { id: "branch", type: "alert", x: 625, y: 310, w: 200, h: 70, label: "Rẽ nhánh", sub: "2 lệnh bị hủy" },
      { id: "speed", type: "star", x: 340, y: 195, w: 200, h: 70, label: "Tăng tốc thực", sub: "5 tầng, chỉ đạt 3,6" }
    ],
    edges: [
      { id: "if-id", from: "if", to: "id", kind: "request", label: "lệnh kế tiếp", bow: 22 },
      { id: "id-if", from: "id", to: "if", kind: "control", label: "giữ tầng khi chờ", bow: -22 },
      { id: "id-ex", from: "id", to: "ex", kind: "control", label: "lệnh đã giải mã" },
      { id: "ex-mem", from: "ex", to: "mem", kind: "data", label: "địa chỉ, dữ liệu" },
      { id: "mem-wb", from: "mem", to: "wb", kind: "data", label: "kết quả" },
      { id: "branch-if", from: "branch", to: "if", kind: "control", label: "nạp lại" },
      { id: "branch-ex", from: "branch", to: "ex", kind: "control", label: "hủy lệnh sai" }
    ],
    learn: [
      "Năm tầng chồng việc của năm lệnh trong cùng một chu kỳ.",
      "Tăng tốc lý thuyết bằng số tầng, ở đây là <code>5 lần</code>.",
      "Rẽ nhánh đoán sai phải hủy 2 lệnh đã nạp, mất 2 chu kỳ.",
      "Hazard dữ liệu và rẽ nhánh kéo CPI thực lên, chỉ còn 3,6 lần."
    ],
    steps: [
      {
        short: "Năm tầng",
        type: "concept",
        title: "Năm tầng chạy chồng nhau",
        body: "Đường ống chia việc xử lý một lệnh thành năm tầng: nạp lệnh, giải mã, thực thi, truy cập bộ nhớ và ghi lại. Khi ống đã đầy, mỗi chu kỳ có năm lệnh đang ở năm tầng khác nhau, nên gần như mỗi chu kỳ xong một lệnh. Tăng tốc lý thuyết bằng số tầng, tức <code>5 lần</code> so với cách chạy tuần tự một lệnh một lúc. Nhưng chỉ khi mọi lệnh đều đi đúng đường và không lệnh nào phải chờ kết quả của lệnh trước. Thực tế, rẽ nhánh và hazard dữ liệu phá vỡ điều kiện đó, nên hiệu năng đo được thấp hơn con số 5 đáng kể.",
        focus: ["if", "id", "ex", "mem"],
        edges: ["if-id", "id-ex", "ex-mem"],
        metrics: { stages: "5", idealSpeedup: "5×", stallPct: "0%", ok: "lý thuyết" },
        changes: [
          "Năm lệnh nằm chồng ở năm tầng trong cùng một chu kỳ.",
          "Mốc so sánh được đặt là 5 lần, không phải một con số cảm tính."
        ],
        note: "Ống càng sâu thì tăng tốc lý thuyết càng cao, nhưng giá mỗi lần sai cũng tăng."
      },
      {
        short: "Lấp ống",
        type: "flow",
        title: "100 lệnh mất 104 chu kỳ",
        body: "Với 100 lệnh, bốn lệnh đầu chỉ lấp ống nên mất 5 chu kỳ, sau đó mỗi chu kỳ xong thêm một lệnh. Tổng là <code>5 + 99 = 104 chu kỳ</code>, tức 1,04 chu kỳ mỗi lệnh. Nếu chạy tuần tự, 100 lệnh nhân 5 tầng là 500 chu kỳ, nên tăng tốc đạt 4,8 lần, sát mức lý thuyết. Phần chênh 4 chu kỳ là chi phí khởi động, càng ít quan trọng khi chương trình càng dài. Với một triệu lệnh, chi phí đó gần như biến mất và CPI tiến về 1. Nhưng con số 1,04 này chỉ đúng khi không có lệnh nào rẽ nhánh hay chờ dữ liệu.",
        focus: ["if", "id", "ex", "wb"],
        edges: ["if-id", "id-ex", "mem-wb"],
        metrics: { stages: "5", idealSpeedup: "5×", stallPct: "4%", ok: "1,04 chu kỳ/lệnh" },
        changes: [
          "Thời gian 100 lệnh giảm từ 500 xuống 104 chu kỳ.",
          "Bốn chu kỳ khởi động chỉ còn là sai số với chương trình dài."
        ],
        note: "Công thức gần đúng cho ống đầy là số lệnh cộng số tầng trừ một."
      },
      {
        short: "Rẽ nhánh",
        type: "detail",
        title: "Rẽ nhánh phá ống thế nào",
        body: "Khi gặp lệnh rẽ nhánh, phần nạp lệnh chưa biết địa chỉ đích nên vẫn nạp tiếp theo thứ tự. Nếu nhánh đổi hướng, hai lệnh vừa nạp là sai và bị hủy, ống mất 2 chu kỳ. Với 20% lệnh là rẽ nhánh và mỗi lần sai mất 2 chu kỳ, CPI tăng thêm <code>0,2 × 2 = 0,4</code>, thành 1,4. Tăng tốc thực là 5 chia 1,4, khoảng 3,6 lần. Con số này giải thích vì sao CPU hiện đại đầu tư rất nhiều vào dự đoán nhánh: chỉ cần đoán đúng thường xuyên hơn là đã lấy lại phần lớn hiệu năng. Vòng lặp có điều kiện ngắn là nơi thiệt hại rõ nhất.",
        focus: ["branch", "ex", "speed"],
        edges: ["branch-ex", "branch-if", "id-ex"],
        metrics: { stages: "5", idealSpeedup: "5×", stallPct: "29%", ok: "3,6×" },
        changes: [
          "CPI tăng từ 1,0 lên 1,4 vì 20% lệnh rẽ nhánh.",
          "Tăng tốc thực tụt từ 5 lần xuống 3,6 lần."
        ],
        note: "Hai chu kỳ bị hủy mỗi lần đoán sai là lý do các ống sâu cần dự đoán tốt."
      },
      {
        short: "Hazard dữ liệu",
        type: "pitfall",
        title: "Hazard dữ liệu và chuyển tiếp",
        body: "Hazard dữ liệu xảy ra khi lệnh sau cần giá trị mà lệnh trước chưa ghi lại. Ví dụ lệnh nạp từ bộ nhớ rồi cộng ngay vào thanh ghi: dù có chuyển tiếp kết quả, vẫn phải chờ một chu kỳ. Nếu không chuyển tiếp, phải chờ hai đến ba chu kỳ, và CPI tăng nhanh hơn cả rẽ nhánh. Với 12% lệnh phải chờ một chu kỳ, CPI cộng thêm 0,12, thành 1,52, tăng tốc còn <code>5 ÷ 1,52 ≈ 3,3 lần</code>. Cách giảm là sắp xếp lại thứ tự lệnh để lấp khoảng trống, hoặc để trình biên dịch làm việc đó. Đừng đọc số tầng rồi suy ra hiệu năng thật.",
        focus: ["id", "ex", "wb", "speed"],
        edges: ["id-ex", "mem-wb", "id-if"],
        metrics: { stages: "5", idealSpeedup: "5×", stallPct: "34%", ok: "3,3×" },
        changes: [
          "Thêm 12% lệnh chờ dữ liệu, CPI lên 1,52.",
          "Tăng tốc thực còn 3,3 lần, thấp hơn cả trường hợp chỉ có rẽ nhánh."
        ],
        note: "Chuyển tiếp giảm một chu kỳ chờ nhưng không xóa được lệnh nạp rồi dùng ngay."
      },
      {
        short: "Chốt thực tế",
        type: "final",
        title: "Từ 5 tầng xuống 4,2 lần",
        tone: "final",
        body: "Chốt lại cách đọc một đường ống. Một: tăng tốc lý thuyết bằng số tầng, nhưng đó chỉ là trần. Hai: tính CPI thực bằng 1 cộng phạt rẽ nhánh cộng phạt hazard. Ba: dự đoán nhánh đúng 80% đưa phạt rẽ nhánh về <code>0,2 × 0,2 × 2 = 0,08</code> chu kỳ. Bốn: sắp xếp lại lệnh để hazard còn 0,1 chu kỳ, CPI thành 1,18 và tăng tốc 4,2 lần. Năm: đo lại bằng bộ đếm phần cứng, vì trình biên dịch và bộ dự đoán thay đổi theo phiên bản. Con số 4,2 lần vẫn thấp hơn 5, và khoảng cách đó chính là phần việc của phần mềm.",
        focus: "all",
        edges: "all",
        metrics: { stages: "5", idealSpeedup: "5×", stallPct: "15%", ok: "4,2×" },
        changes: [
          "Phạt rẽ nhánh giảm từ 0,4 xuống 0,08 chu kỳ nhờ dự đoán nhánh.",
          "CPI thực về 1,18, tăng tốc 4,2 lần thay vì 3,6 lần."
        ],
        note: "Số tầng là trần lý thuyết; chi phí thật nằm ở các lần ống phải dừng."
      }
    ]
  };

  T.lessons["power"] = {
    id: "power",
    module: "hieu-nang",
    title: "Công suất và nhiệt",
    shortTitle: "Công suất",
    subtitle: "16 lõi, 140 W và hạn 120 W",
    blurb: "Mười sáu lõi, mỗi lõi 10 W ở tải 75%, cộng 20 W nền cho ra 140 W, vượt hạn 120 W. Bài tính công suất theo lõi, so hai cách hạ tải và giải thích vì sao hạ xung rẻ hơn tắt lõi.",
    duration: "12 phút",
    level: "Trung cấp",
    tags: ["công suất", "nhiệt", "số lõi", "hạ xung", "nguồn"],
    metrics: [
      { key: "cores", label: "Số lõi", tone: "blue" },
      { key: "watts", label: "Công suất", tone: "yellow" },
      { key: "limitW", label: "Hạn mức", tone: "mint" },
      { key: "ok", label: "Kết luận", tone: "coral" }
    ],
    nodes: [
      { id: "rack", type: "server", x: 55, y: 80, w: 200, h: 70, label: "Máy chủ 2U", sub: "16 lõi, tải 75%" },
      { id: "cores", type: "grid", x: 340, y: 80, w: 200, h: 70, label: "16 lõi", sub: "10 W mỗi lõi" },
      { id: "load", type: "signal", x: 625, y: 80, w: 200, h: 70, label: "Tải 75%", sub: "12 lõi đang bận" },
      { id: "base", type: "layers", x: 55, y: 310, w: 200, h: 70, label: "Công suất nền", sub: "20 W cho RAM, quạt" },
      { id: "total", type: "bolt", x: 340, y: 310, w: 200, h: 70, label: "Tổng 140 W", sub: "120 W lõi, 20 W nền" },
      { id: "cap", type: "shield", x: 625, y: 310, w: 200, h: 70, label: "Hạn 120 W", sub: "nguồn và tản nhiệt" },
      { id: "heat", type: "alert", x: 340, y: 195, w: 200, h: 70, label: "Vượt 20 W", sub: "nhiệt tăng, tự hạ xung" }
    ],
    edges: [
      { id: "rack-cores", from: "rack", to: "cores", kind: "request", label: "cấp tải" },
      { id: "cores-load", from: "cores", to: "load", kind: "data", label: "12 lõi bận" },
      { id: "load-total", from: "load", to: "total", kind: "data", label: "120 W" },
      { id: "base-total", from: "base", to: "total", kind: "data", label: "20 W" },
      { id: "total-cap", from: "total", to: "cap", kind: "data", label: "so hạn mức" },
      { id: "cap-heat", from: "cap", to: "heat", kind: "control", label: "vượt 20 W" },
      { id: "heat-rack", from: "heat", to: "rack", kind: "control", label: "hạ xung" }
    ],
    learn: [
      "Công suất bằng nền cộng số lõi nhân công suất lõi nhân tải.",
      "16 lõi 10 W ở tải 75% là 120 W, cộng nền 20 W thành <code>140 W</code>.",
      "Hạn 120 W bị vượt 20 W dù máy chưa chạy hết tải.",
      "Hạ xung giảm công suất theo bình phương điện áp, rẻ hơn tắt lõi."
    ],
    steps: [
      {
        short: "Cộng theo lõi",
        type: "concept",
        title: "Công suất cộng theo từng lõi",
        body: "Công suất của một máy chủ gồm hai phần: phần nền gần như cố định cho RAM, quạt, ổ đĩa và chip điều khiển, và phần động theo số lõi đang chạy. Công thức đơn giản là <code>P = P_nền + N × P_lõi × tải</code>. Với 16 lõi, mỗi lõi 10 W, tải 75%, phần lõi là 120 W; cộng 20 W nền thành 140 W. Hạn 120 W của nguồn và tản nhiệt bị vượt 20 W, tức khoảng 17%. Con số này chưa tính quạt chạy mạnh hơn khi nhiệt tăng, nên mức vượt thực có thể cao hơn. Đây là lý do phải tính công suất trước khi lắp, không chỉ nhìn số lõi.",
        focus: ["rack", "cores", "load", "base"],
        edges: ["rack-cores", "cores-load", "base-total"],
        metrics: { cores: "16", watts: "140 W", limitW: "120 W", ok: "vượt 20 W" },
        changes: [
          "Công suất được tách thành phần nền và phần theo lõi.",
          "Tổng 140 W vượt hạn 120 W ngay ở mức tải 75%."
        ],
        note: "Phần nền không nhỏ: 20 W trên 140 W là gần 15% tổng công suất."
      },
      {
        short: "Tải 100%",
        type: "flow",
        title: "Nếu tải lên 100% thì sao",
        body: "Tải 75% nghĩa là 12 lõi bận thật sự, bốn lõi còn lại nhàn rỗi nhưng vẫn tốn điện rò. Khi tải lên 100%, phần lõi thành 160 W và tổng là 180 W, vượt hạn 60 W. Đỉnh này thường chỉ kéo dài vài giây lúc khởi động hoặc khi chạy báo cáo, nhưng đủ để nguồn cắt hoặc chip tự hạ xung. Vì vậy phải tính theo đỉnh chứ không theo trung bình ngày. Một mẹo thực dụng: đặt trần công suất mềm thấp hơn hạn 10 đến 15%, để khoảng dư đó hấp thụ đỉnh mà không phải mua nguồn lớn hơn.",
        focus: ["load", "cores", "total"],
        edges: ["cores-load", "load-total"],
        metrics: { cores: "16", watts: "180 W", limitW: "120 W", ok: "vượt 60 W" },
        changes: [
          "Ở tải 100%, tổng công suất lên 180 W thay vì 140 W.",
          "Mức vượt hạn tăng từ 20 W lên 60 W, đủ để nguồn cắt."
        ],
        note: "Đỉnh vài giây vẫn có thể làm hỏng việc, nên hạn phải tính theo đỉnh."
      },
      {
        short: "Hạ xung",
        type: "detail",
        title: "Hạ xung 20% giảm 30% công suất",
        body: "Công suất động của lõi tỉ lệ với xung nhịp và bình phương điện áp. Hạ xung 20% thường đi kèm hạ điện áp một bậc, nên công suất lõi giảm khoảng 30%, từ 120 W xuống 84 W. Tổng còn 104 W, nằm dưới hạn 120 W với biên 16 W. Hiệu năng giảm ít hơn mức 20% vì phần lớn tác vụ có chờ bộ nhớ hoặc chờ mạng. Với máy chủ chạy 16 lõi, đây thường là lựa chọn tốt nhất: giữ nguyên số lõi, chỉ chỉnh đường cong điện áp và xung. Cần đo lại nhiệt độ và kiểm tra xung có dao động khi tải thay đổi.",
        focus: ["cores", "total", "cap"],
        edges: ["load-total", "total-cap", "cap-heat"],
        metrics: { cores: "16", watts: "104 W", limitW: "120 W", ok: "đạt" },
        changes: [
          "Công suất lõi giảm từ 120 W xuống 84 W, tổng còn 104 W.",
          "Toàn bộ 16 lõi vẫn hoạt động, chỉ giảm xung và điện áp."
        ],
        note: "Hạ xung kèm hạ điện áp mới có lợi lớn; chỉ hạ xung thì giảm rất ít."
      },
      {
        short: "Tắt lõi",
        type: "pitfall",
        title: "Tắt lõi và cái bẫy tăng quạt",
        body: "Tắt 8 lõi đưa công suất lõi về 80 W, tổng 100 W, đạt hạn nhưng mất một nửa năng lực xử lý và không còn biên cho đỉnh. Với tác vụ chạy song song, mất 8 lõi làm thời gian tăng gần gấp đôi, trong khi hạ xung chỉ làm chậm 15 đến 20%. Cái bẫy thứ hai là tăng tốc quạt: quạt chỉ chuyển nhiệt ra khỏi chip nhanh hơn, không giảm một watt điện tiêu thụ, và còn ăn thêm vài chục watt. Cái bẫy thứ ba là bỏ hạn mức, để chip chạm 95 độ rồi tự hạ xung hàng loạt, gây dao động hiệu năng khó đoán hơn nhiều.",
        focus: ["cores", "heat", "cap"],
        edges: ["cap-heat", "heat-rack", "cores-load"],
        metrics: { cores: "8", watts: "100 W", limitW: "120 W", ok: "đạt, mất 50%" },
        changes: [
          "Tắt 8 lõi đưa tổng về 100 W nhưng mất một nửa năng lực.",
          "Quạt chạy mạnh chỉ giảm nhiệt độ, không giảm công suất điện."
        ],
        note: "Thiếu biên công suất thì đỉnh tải sẽ tự biến thành hiện tượng hạ xung."
      },
      {
        short: "Chốt hạn mức",
        type: "final",
        title: "Đặt trần công suất có biên",
        tone: "final",
        body: "Chốt lại cách giữ máy chủ trong hạn. Một: tính công suất theo công thức nền cộng lõi nhân tải, dùng số đo thật cho mỗi lõi. Hai: lấy đỉnh tải, không lấy trung bình ngày, rồi chừa biên 10 đến 15%. Ba: ưu tiên hạ xung kèm hạ điện áp, vì giảm 20% xung chỉ mất khoảng 15% hiệu năng nhưng giảm 30% công suất. Bốn: chỉ tắt lõi khi tác vụ không cần song song. Năm: đặt trần 110 W và giám sát bằng bộ đếm năng lượng của chip. Với ví dụ trong bài, hạ xung đưa 140 W về 104 W, đạt hạn 120 W với biên 16 W và giữ đủ 16 lõi.",
        focus: "all",
        edges: "all",
        metrics: { cores: "16", watts: "104 W", limitW: "120 W", ok: "đạt, biên 16 W" },
        changes: [
          "Máy chủ giữ đủ 16 lõi nhưng nằm dưới hạn với biên 16 W.",
          "Có trần mềm 110 W và giám sát năng lượng thay vì đối phó khi quá nhiệt."
        ],
        note: "Công suất và nhiệt là hai ràng buộc khác nhau; hạn thấp hơn sẽ quyết định."
      }
    ]
  };

  T.practice.push({
    id: "cache-phi-truot",
    module: "hieu-nang",
    tag: "CACHE",
    tags: ["cache", "phạt trượt", "tỉ lệ trúng", "chu kỳ trung bình"],
    title: "Trúng 90% nhưng mỗi truy cập 34 chu kỳ",
    scenario: "Một dịch vụ tra cứu đơn hàng chạy trên máy chủ 3 GHz, mỗi giây phục vụ 20.000 yêu cầu, mỗi yêu cầu đọc khoảng 50 khóa trong bộ nhớ đệm. Tỉ lệ trúng đo được là 90%, thời gian trúng 4 chu kỳ, nhưng phạt trượt lên tới 300 chu kỳ vì dữ liệu không nằm trong L2. Trung bình mỗi truy cập tốn 34 chu kỳ, gấp hơn ba lần mục tiêu 10 chu kỳ. Nhóm có hai tuần và ngân sách cho đúng một thay đổi kiến trúc. Bạn chọn hướng nào để hạ chi phí mỗi truy cập một cách bền vững?",
    metrics: [
      { label: "Tỉ lệ trúng", value: "90%" },
      { label: "Phạt trượt", value: "300 chu kỳ", danger: true },
      { label: "Mỗi truy cập", value: "34 chu kỳ", danger: true }
    ],
    options: [
      "Nâng xung từ 3 GHz lên 4 GHz để mỗi chu kỳ ngắn hơn",
      "Chỉ nới L1 thêm 32 kilobyte để đưa tỉ lệ trúng lên 95%",
      "Thêm tầng L2 và nạp trước để phạt trượt còn 120 chu kỳ, đồng thời nâng tỉ lệ trúng lên 95%",
      "Giữ nguyên cache và gộp nhiều yêu cầu thành một lần đọc lớn"
    ],
    correct: 2,
    explain: "Đáp án đúng cho <code>4 + 0,05 × 120 = 10 chu kỳ</code>, vừa chạm mục tiêu và có biên khi dữ liệu lớn lên. Nâng xung không giúp vì độ trễ bộ nhớ tính bằng nanôgiây, chu kỳ ngắn hơn thì phạt trượt quy ra chu kỳ còn tăng, có thể lên 400 chu kỳ và chi phí thành 44 chu kỳ. Chỉ nới L1 cho 95% vẫn tốn 19 chu kỳ vì phạt 300 quá lớn. Gộp yêu cầu giảm số truy cập nhưng mỗi truy cập vẫn 34 chu kỳ, lại thêm mã phức tạp. Phải tấn công cả tỉ lệ trượt lẫn phạt trượt."
  });

  T.practice.push({
    id: "power-han-200w",
    module: "hieu-nang",
    tag: "POWER",
    tags: ["công suất", "hạ xung", "tắt lõi", "nhiệt"],
    title: "Máy chủ 32 lõi chạm 260 W",
    scenario: "Một cụm máy chủ 32 lõi chạy tác vụ mã hóa theo lô. Mỗi lõi ăn 6,5 W khi chạy hết tải, cộng 52 W nền cho RAM và quạt, tổng đo tại ổ cắm là 260 W. Hạn của thanh phân phối trong tủ rack là 200 W mỗi máy, nhiệt độ phòng đã ở 28 độ. Tác vụ chạy ban đêm nên chậm 15% vẫn chấp nhận được, nhưng không được mất dữ liệu và phải giữ ít nhất 28 lõi để kịp cửa sổ sao lưu. Quản trị viên đưa ra bốn phương án. Bạn chọn cách nào?",
    metrics: [
      { label: "Công suất đo", value: "260 W", danger: true },
      { label: "Hạn mỗi máy", value: "200 W" },
      { label: "Lõi tối thiểu", value: "28" }
    ],
    options: [
      "Tăng tốc quạt và mở thêm khe gió để hạ nhiệt độ chip",
      "Hạ xung khoảng 20% kèm hạ điện áp và tắt 4 lõi ít tải",
      "Tắt 12 lõi để công suất chắc chắn xuống dưới 200 W",
      "Giữ nguyên cấu hình và nâng hạn cầu chì của tủ rack"
    ],
    correct: 1,
    explain: "Hạ xung 20% kèm hạ điện áp giảm công suất lõi khoảng 30%: 28 lõi còn khoảng 127 W, cộng nền 48 W thành 175 W, dưới hạn 25 W. Hiệu năng chỉ giảm khoảng 15% vì tác vụ có chờ I/O. Tắt 12 lõi xuống 182 W nhưng chỉ còn 20 lõi, không đủ 28 lõi và mất 37% năng lực. Tăng quạt không giảm một watt điện tiêu thụ, còn ăn thêm 10 đến 15 W. Nâng hạn cầu chì là vượt thiết kế dây và thanh phân phối, rủi ro cháy và mất bảo hành. Công suất tỉ lệ với bình phương điện áp nhân xung."
  });

  T.cheatsheets.push({
    id: "performance",
    num: "02",
    module: "hieu-nang",
    title: "Bảng tra hiệu năng",
    intro: "Năm thẻ tra nhanh cho phần hiệu năng: công thức thời gian và CPI, bảng chi phí cache, sơ đồ năm tầng ống lệnh, cách tính công suất theo lõi và checklist chọn cấu hình trước khi mua hoặc nâng cấp máy.",
    cards: [
      {
        title: "Công thức thời gian và CPI",
        wide: true,
        html: "<table class=\"cheat-table\"><thead><tr><th>Đại lượng</th><th>Công thức</th><th>Ví dụ</th></tr></thead><tbody><tr><td>Thời gian chạy</td><td class=\"mono\">T = IC × CPI ÷ f</td><td>1 tỉ × 2 ÷ 3 GHz = 0,67 s</td></tr><tr><td>Số chu kỳ</td><td class=\"mono\">C = IC × CPI</td><td>1 tỉ × 2 = 2 tỉ chu kỳ</td></tr><tr><td>CPI trung bình</td><td class=\"mono\">tổng (tỉ lệ × CPI)</td><td>0,6 × 1 + 0,4 × 3,5 = 2,0</td></tr><tr><td>Đổi đơn vị</td><td class=\"mono\">1 GHz = 1 tỉ chu kỳ/giây</td><td>3 GHz: 0,33 ns mỗi chu kỳ</td></tr></tbody></table><p>Đo CPI trên máy thật, giữ biên 20 đến 30% trước khi cam kết thời gian.</p>"
      },
      {
        title: "Bảng tra cache",
        wide: true,
        html: "<table class=\"cheat-table\"><thead><tr><th>Tỉ lệ trúng</th><th>Trúng</th><th>Phạt trượt</th><th>Chu kỳ trung bình</th></tr></thead><tbody><tr><td>90%</td><td>4</td><td>100</td><td class=\"mono\">14</td></tr><tr><td>95%</td><td>4</td><td>100</td><td class=\"mono\">9</td></tr><tr><td>90%</td><td>4</td><td>40</td><td class=\"mono\">8</td></tr><tr><td>95%</td><td>4</td><td>40</td><td class=\"mono\">6</td></tr></tbody></table><p>Công thức: thời gian trúng cộng (1 trừ tỉ lệ trúng) nhân phạt trượt. Tỉ lệ trúng 90% và phạt 300 cho 34 chu kỳ.</p>"
      },
      {
        title: "Sơ đồ năm tầng ống lệnh",
        html: "<div style=\"margin-top:10px;overflow-x:auto\"><pre><code>1  nap lenh      IF\n2  giai ma       ID\n3  thuc thi      EX\n4  truy cap      MEM\n5  ghi lai       WB\n\n100 lenh = 5 + 99 = 104 chu ky\nCPI = 1 + p_re_nhanh + p_hazard\n5 tang: tran 5 lan, thuc te 3,6 lan\nkhi 20% lenh re nhanh sai 2 chu ky</code></pre></div><p>Rẽ nhánh và hazard dữ liệu là hai nguồn mất chu kỳ lớn nhất.</p>"
      },
      {
        title: "Công suất theo lõi",
        wide: true,
        html: "<table class=\"cheat-table\"><thead><tr><th>Cấu hình</th><th>Lõi bận</th><th>W mỗi lõi</th><th>Tổng</th></tr></thead><tbody><tr><td>16 lõi, tải 75%</td><td>12</td><td>10</td><td class=\"mono\">140 W</td></tr><tr><td>16 lõi, tải 100%</td><td>16</td><td>10</td><td class=\"mono\">180 W</td></tr><tr><td>Hạ xung 20%</td><td>12</td><td>7</td><td class=\"mono\">104 W</td></tr><tr><td>Tắt 8 lõi</td><td>8</td><td>10</td><td class=\"mono\">100 W</td></tr></tbody></table><p>Nền 20 W cho RAM và quạt. Hạ xung kèm hạ điện áp giảm khoảng 30% công suất lõi.</p>"
      },
      {
        title: "Checklist chọn cấu hình",
        html: "<ul style=\"margin-top:9px;padding-left:16px;font-size:.7rem;line-height:1.55;color:var(--text-soft)\"><li>Tính thời gian từ số lệnh, CPI đo được và xung hiệu dụng.</li><li>Đo tỉ lệ trúng, thời gian trúng và phạt trượt trên dữ liệu thật.</li><li>Giữ biên 20% cho hạn thời gian, 10 đến 15% cho hạn công suất.</li><li>Ưu tiên giảm số lệnh, rồi hạ CPI, cuối cùng mới nâng xung.</li><li>Kiểm tra hạn của nguồn, thanh phân phối và tản nhiệt theo đỉnh tải.</li><li>Đo lại sau mỗi lần đổi cấu hình hoặc tăng kích thước dữ liệu.</li></ul>"
      }
    ]
  });
})();
