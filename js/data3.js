/* HWLab — phần 3: module hệ thống nhúng, tình huống và bảng tra */
window.HWLAB = window.HWLAB || { modules: [], lessons: {}, practice: [], cheatsheets: [] };

(function () {
  const T = window.HWLAB;

  T.modules.push({
    id: "he-thong-nhung",
    num: "03",
    title: "Hệ thống nhúng",
    tone: "yellow",
    blurb: "Hệ thống nhúng là máy tính nhỏ nằm trong một thiết bị: lò vi sóng, xe máy, máy đo nhịp tim. Bốn bài đi từ chọn vi điều khiển, lấy mẫu cảm biến, giữ hạn phản hồi thời gian thực đến nạp firmware và cập nhật từ xa an toàn.",
    lessons: ["mcu", "sensor", "realtime", "firmware"]
  });

  T.lessons["mcu"] = {
    id: "mcu",
    module: "he-thong-nhung",
    title: "Vi điều khiển",
    shortTitle: "Vi điều khiển",
    subtitle: "Một máy tính nhỏ trên một chip",
    blurb: "Vi điều khiển gói CPU, RAM, flash và chân vào ra trong một chip giá rẻ. Bài này chỉ ra vì sao 32 KB RAM đủ cho máy giặt, cách chọn chip theo nhiệm vụ, và giới hạn khiến mã máy tính không chạy nổi.",
    duration: "12 phút",
    level: "Cơ bản",
    tags: ["vi điều khiển", "Cortex-M0+", "SRAM", "flash", "chân vào ra"],
    metrics: [
      { key: "mcuCores", label: "Số lõi", tone: "blue" },
      { key: "ramKB", label: "RAM", tone: "mint" },
      { key: "clockMHz", label: "Xung nhịp", tone: "yellow" },
      { key: "ok", label: "Kết luận", tone: "coral" }
    ],
    nodes: [
      { id: "cpu", type: "code", x: 55, y: 80, w: 200, h: 70, label: "Lõi Cortex-M0+", sub: "48 MHz, 1 lõi" },
      { id: "sram", type: "memory", x: 340, y: 80, w: 200, h: 70, label: "SRAM 32 KB", sub: "biến và ngăn xếp" },
      { id: "flash", type: "disk", x: 625, y: 80, w: 200, h: 70, label: "Flash 256 KB", sub: "chương trình đã nạp" },
      { id: "gpio", type: "signal", x: 55, y: 310, w: 200, h: 70, label: "Chân vào ra", sub: "24 chân số đa dụng" },
      { id: "timer", type: "clock", x: 340, y: 310, w: 200, h: 70, label: "Bộ định thời", sub: "ngắt đều mỗi 1 ms" },
      { id: "uart", type: "api", x: 625, y: 310, w: 200, h: 70, label: "UART 115200", sub: "log ra máy tính" },
      { id: "pick", type: "star", x: 340, y: 195, w: 200, h: 70, label: "Chọn vi điều khiển", sub: "đủ chân, đủ RAM" }
    ],
    edges: [
      { id: "flash-cpu", from: "flash", to: "cpu", kind: "data", label: "nạp lệnh" },
      { id: "cpu-sram", from: "cpu", to: "sram", kind: "data", label: "biến, ngăn xếp", bow: 22 },
      { id: "sram-cpu", from: "sram", to: "cpu", kind: "data", label: "trả kết quả", bow: -22 },
      { id: "cpu-gpio", from: "cpu", to: "gpio", kind: "control", label: "mức logic 3,3 V" },
      { id: "timer-cpu", from: "timer", to: "cpu", kind: "control", label: "ngắt mỗi 1 ms" },
      { id: "cpu-uart", from: "cpu", to: "uart", kind: "data", label: "log ra UART" },
      { id: "pick-cpu", from: "pick", to: "cpu", kind: "control", label: "chọn theo việc" }
    ],
    learn: [
      "Một chip gồm lõi CPU, SRAM, flash và các khối ngoại vi.",
      "SRAM 32 KB phải chia cho biến, ngăn xếp và heap.",
      "Chân vào ra chỉ chịu khoảng 20 mA, động cơ cần mạch công suất.",
      "Chọn chip theo số chân, dung lượng RAM và ngoại vi bắt buộc."
    ],
    steps: [
      {
        short: "Ba khối trong chip",
        type: "concept",
        title: "Một chip, ba khối nhớ",
        body: "Một vi điều khiển là máy tính thu nhỏ trên một chip: lõi CPU, SRAM để chứa biến, flash để chứa chương trình, cộng thêm các khối ngoại vi như chân số, bộ định thời và bộ chuyển đổi ADC. Khác với máy tính để bàn, không có ổ đĩa và không có hệ điều hành đầy đủ; chương trình nằm trong <code>flash</code> 256 KB và chạy trực tiếp sau khi cấp điện. Con chip STM32F0 trong bài có 32 KB SRAM, 48 MHz, giá khoảng 30.000 đồng. Toàn bộ hệ thống chạy trong vài mili ampe, nuôi bằng pin cúc áo nhiều tháng. Chính vì tài nguyên ít nên mỗi byte RAM và mỗi chu kỳ đều phải tính.",
        focus: ["cpu", "sram", "flash"],
        edges: ["flash-cpu", "cpu-sram"],
        metrics: { mcuCores: "1", ramKB: "32", clockMHz: "48", ok: "đủ" },
        changes: [
          "Chương trình nằm trong flash thay vì đĩa, chạy ngay khi cấp điện.",
          "Toàn bộ dữ liệu làm việc chỉ có 32 KB SRAM."
        ],
        note: "Không có ổ đĩa và không có hệ điều hành: mọi thứ nằm trong một chip."
      },
      {
        short: "Nạp chương trình",
        type: "flow",
        title: "Từ mã C vào flash",
        body: "Trình biên dịch biến mã C thành mã máy cho lõi, liên kết thành tệp <code>.hex</code> rồi nạp vào flash qua giao diện SWD. Khi cấp điện, lõi đọc vector khởi động ở địa chỉ đầu flash, nhảy tới hàm khởi tạo, sao chép các biến có giá trị ban đầu từ flash sang SRAM và đặt con trỏ ngăn xếp. Sau đó vòng lặp chính chạy mãi. Flash chỉ ghi được theo trang 1 KB và chịu khoảng 10.000 lần xóa, nên không dùng làm nơi lưu dữ liệu thay đổi liên tục. SRAM 32 KB phải chia cho biến toàn cục, ngăn xếp và heap; một mảng 4 KB đã chiếm một phần tám. Hiểu bản đồ bộ nhớ này là điều kiện để sửa lỗi tràn.",
        focus: ["flash", "cpu", "sram"],
        edges: ["flash-cpu", "cpu-sram", "sram-cpu"],
        metrics: { mcuCores: "1", ramKB: "32", clockMHz: "48", ok: "đạt" },
        changes: [
          "Biến có giá trị ban đầu được chép từ flash sang SRAM lúc khởi động.",
          "Flash chỉ ghi theo trang và giới hạn 10.000 lần xóa."
        ],
        note: "Bản đồ bộ nhớ nằm trong linker script; sửa sai là chương trình không chạy."
      },
      {
        short: "Chân vào ra",
        type: "detail",
        title: "Chân số và bộ định thời",
        body: "Phần lớn chân của vi điều khiển là chân vào ra đa dụng, mỗi chân gắn với một thanh ghi cấu hình. Muốn bật đèn LED, mã ghi bit 1 vào thanh ghi đầu ra; muốn đọc nút nhấn, chuyển chân sang chế độ vào và bật điện trở kéo lên nội bộ. Một chân số chỉ có hai mức 0 và 3,3 V, dòng ra tối đa khoảng 20 mA, đủ cho LED nhưng không đủ cho động cơ: phải dùng transistor hoặc mạch cầu H. Bộ định thời đếm xung nhịp và phát ngắt đều mỗi 1 ms, tạo nhịp cho toàn bộ chương trình. Đọc nút nhấn cơ học cần chờ 20 ms để bỏ dội, nếu không một lần bấm bị tính thành năm lần.",
        focus: ["gpio", "timer", "cpu"],
        edges: ["cpu-gpio", "timer-cpu"],
        metrics: { mcuCores: "1", ramKB: "32", clockMHz: "48", ok: "đạt" },
        changes: [
          "Đèn LED và nút nhấn được điều khiển qua thanh ghi của chân số.",
          "Bộ định thời tạo ngắt đều 1 ms làm nhịp cho chương trình."
        ],
        note: "Mỗi chân chỉ chịu khoảng 20 mA; tải lớn phải qua linh kiện công suất."
      },
      {
        short: "Chọn chip sai",
        type: "pitfall",
        title: "Chọn chip theo cảm tính",
        body: "Lỗi phổ biến là chọn chip theo cảm tính rồi phát hiện thiếu chân hoặc thiếu RAM ở tuần cuối. Cách chọn đúng bắt đầu từ danh sách nhiệm vụ: đếm số chân vào ra cần dùng, cộng thêm 20 phần trăm dự phòng; ước lượng RAM cho bộ đệm và ngăn xếp; kiểm tra ngoại vi bắt buộc như UART, I2C, SPI, ADC 12 bit hay bộ so sánh. Nếu cần xử lý ảnh nhỏ, chip 48 MHz với 32 KB RAM sẽ không đủ, phải lên dòng có 256 KB và bộ tăng tốc. Ngoài ra hãy xem mức tiêu thụ ở chế độ ngủ sâu, nhiệt độ hoạt động và số lượng mua được trong ba năm tới.",
        focus: ["pick", "cpu", "uart"],
        edges: ["pick-cpu", "cpu-uart"],
        metrics: { mcuCores: "1", ramKB: "32", clockMHz: "48", ok: "chưa" },
        changes: [
          "Danh sách chân và ngoại vi bắt buộc được lập trước khi chọn chip.",
          "Chip 32 KB RAM bị loại khỏi phương án xử lý ảnh."
        ],
        note: "Chọn thiếu chân ở tuần cuối là lỗi đắt nhất trong dự án nhúng."
      },
      {
        short: "Chốt cách chọn",
        type: "final",
        title: "Bảng chọn vi điều khiển",
        tone: "final",
        body: "Chốt lại bằng cách chọn theo bảng ba cột: nhiệm vụ cần gì, chip có gì, chênh lệch bao nhiêu. Với bài tập trong khóa, chọn lõi Cortex-M0+ 48 MHz, 32 KB SRAM, 256 KB flash, 24 chân vào ra, timer 16 bit và UART. Kiểm tra ba điều trước khi đặt hàng: chân còn dư ít nhất 20 phần trăm, RAM dùng dưới 60 phần trăm, và mọi ngoại vi bắt buộc đều có trên chip chứ không phải chip phụ. Đo dòng tiêu thụ ở chế độ chạy và ngủ sâu bằng đồng hồ vạn năng. Ghi lại nhiệt độ và điện áp hoạt động. Một chip rẻ hơn 5.000 đồng mà thiếu ADC 12 bit sẽ tốn gấp nhiều lần khi phải thêm linh kiện ngoài.",
        focus: "all",
        edges: "all",
        metrics: { mcuCores: "1", ramKB: "32", clockMHz: "48", ok: "đạt" },
        changes: [
          "Cấu hình chip được chốt kèm biên dự phòng chân và RAM.",
          "Mọi ngoại vi bắt buộc nằm trên chip, không cần linh kiện phụ."
        ],
        note: "Đo dòng ở chế độ ngủ sâu trước khi hứa thời lượng pin với khách."
      }
    ]
  };

  T.lessons["sensor"] = {
    id: "sensor",
    module: "he-thong-nhung",
    title: "Cảm biến và lấy mẫu",
    shortTitle: "Cảm biến",
    subtitle: "Tần số lấy mẫu, nhiễu và ADC 12 bit",
    blurb: "Cảm biến biến đại lượng vật lý thành số, nhưng lấy mẫu sai tần số thì dữ liệu vô nghĩa. Bài này nói về ADC 12 bit, nhiễu, và cách chọn tần số lấy mẫu theo Định lý Nyquist cho lò phản ứng công nghiệp.",
    duration: "12 phút",
    level: "Trung cấp",
    tags: ["cảm biến", "ADC 12 bit", "Nyquist", "nhiễu", "lấy mẫu"],
    metrics: [
      { key: "sampleHz", label: "Tần số mẫu", tone: "blue" },
      { key: "adcBits", label: "Độ phân giải", tone: "mint" },
      { key: "noisePct", label: "Nhiễu", tone: "yellow" },
      { key: "ok", label: "Kết luận", tone: "coral" }
    ],
    nodes: [
      { id: "sense", type: "signal", x: 55, y: 80, w: 200, h: 70, label: "Cảm biến nhiệt", sub: "0 đến 3,3 V" },
      { id: "amp", type: "layers", x: 340, y: 80, w: 200, h: 70, label: "Mạch khuếch đại", sub: "hệ số 10" },
      { id: "adc", type: "code", x: 625, y: 80, w: 200, h: 70, label: "ADC 12 bit", sub: "4096 mức, 1 Msps" },
      { id: "filt", type: "grid", x: 55, y: 310, w: 200, h: 70, label: "Lọc trung bình", sub: "8 mẫu gần nhất" },
      { id: "fifo", type: "queue", x: 340, y: 310, w: 200, h: 70, label: "Bộ đệm mẫu", sub: "vòng 64 mục" },
      { id: "alarm", type: "alert", x: 625, y: 310, w: 200, h: 70, label: "Ngưỡng quá nhiệt", sub: "85 độ C" },
      { id: "rate", type: "clock", x: 340, y: 195, w: 200, h: 70, label: "Chọn tần số mẫu", sub: "Nyquist gấp đôi" }
    ],
    edges: [
      { id: "sense-amp", from: "sense", to: "amp", kind: "data", label: "0,3 mV mỗi độ" },
      { id: "amp-adc", from: "amp", to: "adc", kind: "data", label: "0 đến 3 V" },
      { id: "adc-filt", from: "adc", to: "filt", kind: "data", label: "mẫu 12 bit" },
      { id: "filt-fifo", from: "filt", to: "fifo", kind: "data", label: "mẫu đã mịn" },
      { id: "fifo-alarm", from: "fifo", to: "alarm", kind: "data", label: "vượt ngưỡng" },
      { id: "rate-adc", from: "rate", to: "adc", kind: "control", label: "chốt 20 Hz", bow: 22 },
      { id: "adc-rate", from: "adc", to: "rate", kind: "control", label: "báo đã lấy", bow: -22 }
    ],
    learn: [
      "ADC 12 bit chia dải 3,3 V thành 4096 mức, khoảng 0,8 mV.",
      "Định lý lấy mẫu yêu cầu tần số hơn hai lần thành phần nhanh nhất.",
      "Nhiễu từ động cơ làm mẫu nhảy, cần lọc và đi dây đúng.",
      "Sự kiện 0,4 giây cần tần số 20 Hz mới bắt được."
    ],
    steps: [
      {
        short: "Từ nhiệt độ ra số",
        type: "concept",
        title: "Chuỗi từ cảm biến tới số",
        body: "Cảm biến nhiệt kiểu nhiệt điện trở thay đổi điện trở theo nhiệt độ, mạch khuếch đại biến thay đổi nhỏ đó thành điện áp trong khoảng 0 đến 3,3 V, rồi ADC chuyển thành số. Với ADC 12 bit, dải 3,3 V được chia thành <code>4096</code> mức, mỗi mức khoảng 0,8 mV. Nếu cảm biến cho 10 mV mỗi độ C và khuếch đại 10 lần, thì một độ C tương ứng 100 mV, tức khoảng 124 mức, đủ để đọc tới 0,1 độ. Con số 4096 không phải độ chính xác thật: nhiễu, sai số cảm biến và điện áp tham chiếu đều ăn vào. Vì vậy phải đọc datasheet trước khi tin vào chữ số cuối.",
        focus: ["sense", "amp", "adc"],
        edges: ["sense-amp", "amp-adc"],
        metrics: { sampleHz: "20 Hz", adcBits: "12", noisePct: "0,5", ok: "đạt" },
        changes: [
          "Điện áp 0 đến 3,3 V được chia thành 4096 mức rời rạc.",
          "Một độ C tương ứng khoảng 124 mức, đọc được tới 0,1 độ."
        ],
        note: "4096 mức không có nghĩa là chính xác 4096 bậc trong thực tế."
      },
      {
        short: "Định lý Nyquist",
        type: "flow",
        title: "Lấy mẫu theo Định lý Nyquist",
        body: "Định lý lấy mẫu nói rằng muốn dựng lại một tín hiệu, phải lấy mẫu nhanh hơn hai lần tần số cao nhất có trong tín hiệu. Nhiệt độ lò phản ứng thay đổi chậm, nhưng khi van mở đột ngột, nhiệt độ có thể nhảy trong khoảng 0,2 giây, tương ứng thành phần khoảng 5 Hz. Lấy mẫu 1 Hz là quá thấp: sự cố 0,2 giây có thể nằm gọn giữa hai mẫu và không bao giờ được thấy. Chọn <code>20 Hz</code>, tức gấp bốn lần tần số cao nhất, vừa thỏa định lý vừa có biên an toàn cho bộ lọc. Mỗi giây 20 mẫu, bộ đệm 64 mục giữ được hơn ba giây dữ liệu để tính trung bình.",
        focus: ["rate", "adc", "filt"],
        edges: ["rate-adc", "adc-rate", "adc-filt"],
        metrics: { sampleHz: "20 Hz", adcBits: "12", noisePct: "0,5", ok: "đạt" },
        changes: [
          "Tần số lấy mẫu tăng từ 1 Hz lên 20 Hz.",
          "Bộ đệm 64 mục giữ hơn ba giây dữ liệu thay vì 64 giây."
        ],
        note: "Hai lần là mức tối thiểu lý thuyết; thực tế nên chọn gấp bốn đến mười."
      },
      {
        short: "Nhiễu và lọc",
        type: "detail",
        title: "Nhiễu trong tủ điện",
        body: "Tín hiệu từ cảm biến đi qua dây dài trong tủ điện nên dễ hứng nhiễu từ động cơ và biến tần. Nhiễu làm mẫu nhảy vài chục mức, khiến ngưỡng báo động bật tắt liên tục. Ba cách chặn rẻ nhất: dùng cáp xoắn đôi và tụ 100 nF sát chân ADC, lấy trung bình 8 mẫu gần nhất, và thêm trễ 200 ms trước khi bật cảnh báo. Lọc trung bình làm mượt nhưng cũng làm chậm phản hồi, nên với sự cố cần bắt nhanh, hãy so sánh từng mẫu với ngưỡng cứng song song với đường trung bình. Ghi lại phần trăm nhiễu đo được, ví dụ <code>2,5</code> phần trăm, để biết bộ lọc đã đủ chưa.",
        focus: ["amp", "adc", "filt", "fifo"],
        edges: ["amp-adc", "adc-filt", "filt-fifo"],
        metrics: { sampleHz: "20 Hz", adcBits: "12", noisePct: "1,2", ok: "đạt" },
        changes: [
          "Mẫu thô được lấy trung bình 8 mẫu trước khi so ngưỡng.",
          "Cảnh báo mềm có thêm trễ 200 ms để không nhảy liên tục."
        ],
        note: "Lọc làm mượt cũng làm chậm; giữ một đường so sánh thô song song."
      },
      {
        short: "Mẫu quá thưa",
        type: "pitfall",
        title: "Một hertz bỏ lỡ quá nhiệt",
        body: "Ca thường gặp: lò phản ứng được giám sát bằng cảm biến lấy mẫu 1 Hz vì tiết kiệm điện, và một lần quá nhiệt trong 0,4 giây không được ghi nhận. Định lý lấy mẫu giải thích vì sao: với tần số 1 Hz, mọi thay đổi nhanh hơn 0,5 Hz đều có thể bị răng cưa hoặc biến mất hoàn toàn. Thiết bị vẫn báo nhiệt độ bình thường trong khi van đã hỏng. Cách sửa không phải tăng tần số vô hạn mà là xác định sự kiện nhanh nhất cần bắt, chọn tần số gấp 4 đến 10 lần, và đặt cảnh báo cứng chạy bằng ngắt. Với lò này, 20 Hz là đủ và vẫn tiết kiệm pin.",
        focus: ["rate", "sense", "alarm"],
        edges: ["rate-adc", "fifo-alarm"],
        metrics: { sampleHz: "1 Hz", adcBits: "12", noisePct: "3,0", ok: "chưa" },
        changes: [
          "Sự kiện 0,4 giây lọt giữa hai mẫu cách nhau một giây.",
          "Biểu đồ nhiệt độ vẫn phẳng dù van làm mát đã kẹt."
        ],
        note: "Tần số thấp không chỉ làm chậm mà còn làm mất hẳn sự kiện ngắn."
      },
      {
        short: "Chốt quy trình",
        type: "final",
        title: "Quy trình lấy mẫu",
        tone: "final",
        body: "Chốt quy trình lấy mẫu cho một cảm biến công nghiệp. Một: xác định đại lượng, dải đo và sự kiện nhanh nhất cần phát hiện. Hai: chọn cảm biến có độ phân giải và độ chính xác phù hợp, đừng nhầm 12 bit với 0,1 độ. Ba: đặt tần số lấy mẫu gấp 4 đến 10 lần tần số sự kiện, ở đây là <code>20 Hz</code>. Bốn: lọc trung bình 8 mẫu và thêm trễ 200 ms cho cảnh báo mềm. Năm: giữ một đường cảnh báo cứng bằng ngắt, không qua bộ lọc. Sáu: ghi log mẫu thô để truy lại sự cố. Bảy: đo lại nhiễu sau khi đi dây thật trong tủ điện.",
        focus: "all",
        edges: "all",
        metrics: { sampleHz: "20 Hz", adcBits: "12", noisePct: "1,2", ok: "đạt" },
        changes: [
          "Tần số 20 Hz và đường cảnh báo cứng được đưa vào thiết kế.",
          "Log mẫu thô được giữ lại để truy nguyên sự cố."
        ],
        note: "Sự kiện nhanh nhất quyết định tần số, không phải thời lượng pin."
      }
    ]
  };

  T.lessons["realtime"] = {
    id: "realtime",
    module: "he-thong-nhung",
    title: "Thời gian thực",
    shortTitle: "Thời gian thực",
    subtitle: "Hạn phản hồi, jitter và ưu tiên ngắt",
    blurb: "Thời gian thực không phải chạy nhanh mà là kịp hạn. Bài này đo hạn phản hồi 5 ms của vòng điều khiển động cơ, giải thích jitter, ưu tiên ngắt, và vì sao 100 ms là ranh giới của điều khiển cơ khí.",
    duration: "12 phút",
    level: "Trung cấp",
    tags: ["thời gian thực", "hạn phản hồi", "jitter", "ưu tiên ngắt", "PWM"],
    metrics: [
      { key: "periodMs", label: "Chu kỳ", tone: "blue" },
      { key: "handlerMs", label: "Hàm ngắt", tone: "mint" },
      { key: "jitterMs", label: "Jitter", tone: "yellow" },
      { key: "ok", label: "Kết luận", tone: "coral" }
    ],
    nodes: [
      { id: "motor", type: "server", x: 55, y: 80, w: 200, h: 70, label: "Động cơ 3 pha", sub: "3000 vòng mỗi phút" },
      { id: "isr", type: "bolt", x: 340, y: 80, w: 200, h: 70, label: "Hàm ngắt", sub: "chạy 8 ms" },
      { id: "loop", type: "task", x: 625, y: 80, w: 200, h: 70, label: "Vòng chính", sub: "tính PID, ghi log" },
      { id: "timer", type: "clock", x: 55, y: 310, w: 200, h: 70, label: "Bộ định thời", sub: "chu kỳ 5 ms" },
      { id: "pwm", type: "signal", x: 340, y: 310, w: 200, h: 70, label: "Xung PWM", sub: "cập nhật mỗi 5 ms" },
      { id: "jitter", type: "event", x: 625, y: 310, w: 200, h: 70, label: "Jitter", sub: "lệch tới 0,4 ms" },
      { id: "budget", type: "star", x: 340, y: 195, w: 200, h: 70, label: "Ngân sách 5 ms", sub: "ngắt dưới 1 ms" }
    ],
    edges: [
      { id: "timer-isr", from: "timer", to: "isr", kind: "control", label: "ngắt mỗi 5 ms" },
      { id: "isr-pwm", from: "isr", to: "pwm", kind: "control", label: "duty mới", bow: 22 },
      { id: "pwm-isr", from: "pwm", to: "isr", kind: "response", label: "đã áp xong", bow: -22 },
      { id: "pwm-motor", from: "pwm", to: "motor", kind: "control", label: "dòng ba pha" },
      { id: "motor-loop", from: "motor", to: "loop", kind: "data", label: "nhiệt, tốc độ" },
      { id: "loop-pwm", from: "loop", to: "pwm", kind: "data", label: "hệ số PI" },
      { id: "budget-isr", from: "budget", to: "isr", kind: "control", label: "giới hạn 1 ms" }
    ],
    learn: [
      "Thời gian thực là kịp hạn, không phải nhanh nhất có thể.",
      "Chu kỳ điều khiển 5 ms thì mọi việc phải xong trong 5 ms.",
      "Jitter 0,4 ms trên chu kỳ 5 ms đủ làm dòng pha méo.",
      "Hàm ngắt chỉ đọc mẫu và đặt duty, việc nặng đẩy ra vòng chính."
    ],
    steps: [
      {
        short: "Hạn phản hồi",
        type: "concept",
        title: "Thời gian thực là kịp hạn",
        body: "Thời gian thực nghĩa là kết quả phải có trước một hạn, không phải chạy nhanh nhất có thể. Vòng điều khiển động cơ ba pha đọc dòng điện, tính toán rồi cập nhật xung PWM; nếu chu kỳ là <code>5 ms</code>, mọi việc phải xong trong 5 ms đó. Trễ thêm một chu kỳ làm dòng phản hồi lệch pha, động cơ rung và nóng. Hệ điều hành thông thường không hứa được hạn này vì có thể bị ngắt bởi việc khác, nên hệ nhúng dùng ngắt có ưu tiên và vòng lặp tất định. Hạn 100 ms là ranh giới với điều khiển cơ khí: nhanh hơn thì người dùng không thấy, chậm hơn thì thấy rõ.",
        focus: ["timer", "isr", "pwm"],
        edges: ["timer-isr", "isr-pwm"],
        metrics: { periodMs: "5", handlerMs: "chưa đo", jitterMs: "chưa đo", ok: "chưa" },
        changes: [
          "Hạn 5 ms được ghi thành yêu cầu, không phải mục tiêu chung chung.",
          "Mọi công việc trong chu kỳ phải nằm gọn trong 5 ms."
        ],
        note: "Hạn là hợp đồng với phần cứng; trễ một chu kỳ là đã vi phạm."
      },
      {
        short: "Ngắt 8 ms",
        type: "flow",
        title: "Hàm ngắt dài hơn chu kỳ",
        body: "Trong bản đầu tiên, hàm ngắt đọc ADC, tính PID, cập nhật PWM và ghi log qua UART, tổng cộng <code>8 ms</code>. Vì chu kỳ chỉ 5 ms, ngắt này không bao giờ kết thúc trước lần đến sau; các lần ngắt xếp hàng, chương trình chính gần như không chạy và động cơ mất điều khiển. Đo bằng chân báo trạng thái và máy hiện sóng cho thấy xung cao 8 ms trong khi chu kỳ 5 ms. Ngân sách đúng là chia nhỏ: hàm ngắt chỉ đọc mẫu và đặt duty, dưới 1 ms; phần tính PID nặng chuyển sang vòng chính, chạy sau khi ngắt xong. Quy tắc đơn giản: ngắt càng ngắn càng tốt.",
        focus: ["isr", "budget", "pwm"],
        edges: ["isr-pwm", "pwm-isr", "budget-isr"],
        metrics: { periodMs: "5", handlerMs: "8", jitterMs: "3", ok: "trượt" },
        changes: [
          "Hàm ngắt co lại còn dưới 1 ms, chỉ đọc mẫu và đặt duty.",
          "Tính PID và ghi log chuyển sang vòng chính."
        ],
        note: "Ngắt dài hơn chu kỳ thì các lần ngắt xếp hàng và hệ mất điều khiển."
      },
      {
        short: "Jitter",
        type: "detail",
        title: "Jitter và ưu tiên ngắt",
        body: "Jitter là độ lệch của thời điểm thực thi so với lịch, ví dụ ngắt đáng lẽ chạy ở 5,0 ms nhưng có lần tới ở 5,4 ms. Jitter 0,4 ms trên chu kỳ 5 ms là 8 phần trăm, đủ làm dòng ba pha méo và phát tiếng ù. Nguồn jitter thường là ngắt khác có ưu tiên cao hơn, hoặc đoạn mã tắt ngắt quá lâu. Cách giảm: đặt ưu tiên cho ngắt điều khiển cao nhất, giữ đoạn tắt ngắt dưới vài chục micro giây, và dùng bộ định thời phần cứng thay vì đếm vòng lặp. Đo jitter bằng cách bật một chân trong ngắt rồi xem máy hiện sóng, ghi lại giá trị lớn nhất chứ không chỉ trung bình.",
        focus: ["timer", "jitter", "pwm"],
        edges: ["timer-isr", "pwm-motor"],
        metrics: { periodMs: "5", handlerMs: "0,8", jitterMs: "0,4", ok: "trượt" },
        changes: [
          "Ngắt điều khiển được đặt ưu tiên cao nhất trong hệ.",
          "Jitter được đo bằng giá trị lớn nhất, không lấy trung bình."
        ],
        note: "Jitter 8 phần trăm chu kỳ đã đủ gây tiếng ù ở động cơ ba pha."
      },
      {
        short: "Việc nặng trong ngắt",
        type: "pitfall",
        title: "Nhồi việc nặng vào ngắt",
        body: "Việc nặng trong ngắt là lỗi khó thấy nhất vì chương trình vẫn chạy, chỉ chậm dần. Một lệnh ghi log qua UART ở 115200 baud tốn gần 1 ms cho mỗi dòng 10 byte; ba dòng là vượt ngân sách 1 ms. Các phép nhân số thực, quét bàn phím, cấp phát bộ nhớ cũng không nên nằm trong ngắt. Cách tách: ngắt chỉ đọc mẫu, đặt cờ và thoát; vòng chính thấy cờ thì tính toán rồi ghi kết quả. Nếu cần phản hồi cứng, dùng ngắt có ưu tiên cao chỉ cho phần đọc và đặt duty. Ghi log vào bộ đệm vòng trong RAM, gửi ra ngoài sau.",
        focus: ["isr", "loop", "budget"],
        edges: ["isr-pwm", "loop-pwm", "budget-isr"],
        metrics: { periodMs: "5", handlerMs: "8", jitterMs: "3", ok: "trượt" },
        changes: [
          "Ghi log rời khỏi ngắt, đi qua bộ đệm vòng trong RAM.",
          "Vòng chính nhận cờ rồi mới tính toán và gửi dữ liệu."
        ],
        note: "Mỗi dòng log 10 byte ở 115200 baud ăn gần 1 ms của ngân sách."
      },
      {
        short: "Chốt thiết kế",
        type: "final",
        title: "Ngân sách thời gian thực",
        tone: "final",
        body: "Chốt thiết kế thời gian thực cho vòng điều khiển 5 ms. Một: đo trước, đặt chân báo trạng thái và xem máy hiện sóng để biết hàm ngắt thật sự chạy bao lâu. Hai: đặt ngân sách, ví dụ ngắt dưới <code>1 ms</code>, tức 20 phần trăm chu kỳ, phần còn lại để dự phòng. Ba: tách việc nặng ra vòng chính, giao tiếp qua cờ và bộ đệm vòng. Bốn: đặt ưu tiên ngắt rõ ràng, ngắt điều khiển cao hơn UART. Năm: giữ jitter dưới 10 phần trăm chu kỳ. Sáu: đo lại khi thêm tính năng, vì mỗi dòng log đều lấy thời gian từ ngân sách.",
        focus: "all",
        edges: "all",
        metrics: { periodMs: "5", handlerMs: "0,8", jitterMs: "0,3", ok: "đạt" },
        changes: [
          "Hàm ngắt còn 0,8 ms, jitter còn 0,3 ms trên chu kỳ 5 ms.",
          "Có ngân sách ghi thành con số và phép đo lặp lại sau mỗi thay đổi."
        ],
        note: "Đo lại sau mỗi tính năng mới; ngân sách thời gian không tự lớn lên."
      }
    ]
  };

  T.lessons["firmware"] = {
    id: "firmware",
    module: "he-thong-nhung",
    title: "Phần sủng và cập nhật",
    shortTitle: "Firmware",
    subtitle: "Flash, chữ ký và cập nhật OTA",
    blurb: "Firmware là chương trình sống trong flash, không sửa bằng trình soạn thảo. Bài này đi qua bố cục bộ nhớ, cách dựng gói cập nhật OTA, kiểm tra chữ ký trước khi ghi, để bản cập nhật hỏng không làm chết thiết bị.",
    duration: "12 phút",
    level: "Trung cấp",
    tags: ["firmware", "flash", "OTA", "chữ ký số", "bootloader"],
    metrics: [
      { key: "flashKB", label: "Dung lượng flash", tone: "blue" },
      { key: "usedPct", label: "Đã dùng", tone: "mint" },
      { key: "otaSizeKB", label: "Gói OTA", tone: "yellow" },
      { key: "ok", label: "Kết luận", tone: "coral" }
    ],
    nodes: [
      { id: "prog", type: "code", x: 55, y: 80, w: 200, h: 70, label: "Mã nguồn C", sub: "dự án và thư viện" },
      { id: "flash", type: "disk", x: 340, y: 80, w: 200, h: 70, label: "Flash 512 KB", sub: "boot và ứng dụng" },
      { id: "app", type: "layers", x: 625, y: 80, w: 200, h: 70, label: "Vùng ứng dụng", sub: "A/B, hai vùng 200 KB" },
      { id: "ota", type: "api", x: 55, y: 310, w: 200, h: 70, label: "Gói OTA", sub: "tải qua HTTPS" },
      { id: "verify", type: "shield", x: 340, y: 310, w: 200, h: 70, label: "Kiểm chữ ký", sub: "ECDSA P-256" },
      { id: "boot", type: "check", x: 625, y: 310, w: 200, h: 70, label: "Bootloader", sub: "chọn bản tốt" },
      { id: "fail", type: "alert", x: 340, y: 195, w: 200, h: 70, label: "Ảnh cũ còn nguyên", sub: "quay lại bản A" }
    ],
    edges: [
      { id: "prog-flash", from: "prog", to: "flash", kind: "data", label: "biên dịch, nạp" },
      { id: "flash-app", from: "flash", to: "app", kind: "data", label: "ghi vùng B", bow: 22 },
      { id: "app-flash", from: "app", to: "flash", kind: "data", label: "trả ảnh cũ", bow: -22 },
      { id: "ota-verify", from: "ota", to: "verify", kind: "data", label: "gói 180 KB" },
      { id: "verify-flash", from: "verify", to: "flash", kind: "control", label: "cho phép ghi" },
      { id: "boot-app", from: "boot", to: "app", kind: "control", label: "chọn ảnh" },
      { id: "fail-boot", from: "fail", to: "boot", kind: "control", label: "quay lại A" }
    ],
    learn: [
      "Flash chia thành bootloader bảo vệ và hai vùng ứng dụng A/B.",
      "Flash xóa theo trang, nên phải ghi sang vùng còn trống.",
      "Mọi gói OTA phải có chữ ký, kiểm trước khi ghi.",
      "Giữ ảnh cũ và đếm số lần khởi động thất bại để tự quay lui."
    ],
    steps: [
      {
        short: "Firmware ở đâu",
        type: "concept",
        title: "Bố cục flash",
        body: "Firmware là chương trình chạy trên thiết bị, được biên dịch từ C cùng thư viện phần cứng và ghi vào flash. Flash 512 KB của board được chia làm hai phần: bootloader 32 KB ở đầu và vùng ứng dụng phía sau. Bootloader chạy trước, kiểm tra tính hợp lệ của ứng dụng rồi nhảy vào đó. Vì flash chỉ xóa được theo trang, mọi bản cập nhật đều phải ghi sang vùng khác trước khi chuyển con trỏ. Cách bố trí A/B dành hai vùng 200 KB cho hai phiên bản, nhờ vậy thiết bị vẫn có bản cũ để quay lại. Bản đồ bộ nhớ phải được ghi trong linker script, không đoán.",
        focus: ["prog", "flash", "app"],
        edges: ["prog-flash", "flash-app"],
        metrics: { flashKB: "512", usedPct: "12", otaSizeKB: "chưa có", ok: "đạt" },
        changes: [
          "Flash được chia thành bootloader 32 KB và hai vùng ứng dụng.",
          "Bản đồ bộ nhớ được ghi trong linker script thay vì đoán."
        ],
        note: "Bootloader là phần duy nhất không được phép ghi đè khi cập nhật."
      },
      {
        short: "Một lần cập nhật",
        type: "flow",
        title: "Một lần cập nhật OTA",
        body: "Quy trình cập nhật bắt đầu khi thiết bị nhận thông báo có bản mới, tải gói <code>180 KB</code> qua HTTPS vào vùng đệm, rồi kiểm tra tiêu đề: mã thiết bị, phiên bản, kích thước và mã băm. Bước quan trọng nhất là kiểm chữ ký ECDSA trên toàn bộ gói bằng khóa công khai nằm sẵn trong bootloader; sai chữ ký thì xóa gói, không ghi gì. Chữ ký đúng mới cho phép ghi sang vùng B, đọc lại để so sánh, đặt cờ khởi động rồi khởi động lại. Nếu mất điện giữa lúc ghi, cờ chưa được đặt nên lần sau vẫn chạy bản A. Toàn bộ quá trình mất khoảng 40 giây.",
        focus: ["ota", "verify", "flash"],
        edges: ["ota-verify", "verify-flash"],
        metrics: { flashKB: "512", usedPct: "45", otaSizeKB: "180", ok: "đạt" },
        changes: [
          "Gói 180 KB được kiểm chữ ký trước khi chạm vào flash.",
          "Cờ khởi động chỉ được đặt sau khi ghi và đọc lại thành công."
        ],
        note: "Mất điện giữa lúc ghi vẫn an toàn nếu cờ khởi động chưa đổi."
      },
      {
        short: "Kiểm chữ ký",
        type: "detail",
        title: "Chữ ký và chống hạ cấp",
        body: "Chữ ký số là thứ phân biệt bản cập nhật thật với gói do kẻ lạ dựng. Nhà sản xuất giữ khóa riêng và ký mã băm của gói; thiết bị chỉ cần khóa công khai, nằm trong vùng bootloader không ghi được. Khi nhận gói, bootloader tính lại mã băm, giải mã chữ ký và so sánh; lệch một bit là từ chối. Khóa công khai phải được nạp từ nhà máy hoặc ghi một lần, không để chương trình ứng dụng sửa. Cần chống quay lui phiên bản: đặt số phiên bản tối thiểu trong <code>eFuse</code>. Nếu bỏ bước này, kẻ tấn công phát lại bản cũ có lỗ hổng đã biết và thiết bị vui vẻ chấp nhận.",
        focus: ["verify", "boot", "app"],
        edges: ["verify-flash", "boot-app"],
        metrics: { flashKB: "512", usedPct: "45", otaSizeKB: "180", ok: "đạt" },
        changes: [
          "Khóa công khai nằm trong vùng chỉ đọc của bootloader.",
          "Số phiên bản tối thiểu được ghi vào eFuse để chặn hạ cấp."
        ],
        note: "Chữ ký đúng nhưng phiên bản cũ vẫn là cuộc tấn công quay lui."
      },
      {
        short: "Cập nhật chết máy",
        type: "pitfall",
        title: "Ba lỗi làm chết thiết bị",
        body: "Kiểu hỏng nặng nhất là ghi đè trực tiếp lên ứng dụng đang chạy rồi mất điện giữa đường: thiết bị không còn bootloader đúng, không lên được, phải tháo ra nạp lại bằng đầu nạp. Ba lỗi dẫn tới đó: xóa vùng A trước khi kiểm tra gói, đặt cờ khởi động trước khi ghi xong, và cho phép hạ phiên bản. Cách chặn là luôn ghi sang vùng còn trống, kiểm tra sau khi ghi, chỉ đổi cờ khi mọi bước đã xong. Bootloader cần bộ đếm số lần khởi động thất bại: ba lần liên tiếp không lên thì tự quay về ảnh cũ. Ghi lại <code>usedPct</code> của flash để biết còn chỗ cho bản kế tiếp.",
        focus: ["fail", "boot", "flash"],
        edges: ["fail-boot", "verify-flash"],
        metrics: { flashKB: "512", usedPct: "45", otaSizeKB: "180", ok: "chưa" },
        changes: [
          "Bản cập nhật luôn ghi sang vùng trống, không xóa ảnh đang chạy.",
          "Bộ đếm khởi động thất bại tự đưa thiết bị về ảnh cũ."
        ],
        note: "Ba lần khởi động không lên là dấu hiệu phải tự quay lui ngay."
      },
      {
        short: "Chốt quy trình",
        type: "final",
        title: "Quy trình cập nhật an toàn",
        tone: "final",
        body: "Chốt quy trình firmware an toàn cho một thiết bị công nghiệp. Một: chia flash thành bootloader bảo vệ và hai vùng ứng dụng A/B, mỗi vùng 200 KB. Hai: mọi gói cập nhật phải có chữ ký ECDSA, thiết bị kiểm bằng khóa công khai nằm trong bootloader. Ba: ghi sang vùng còn trống, đọc lại so sánh, rồi mới đổi cờ. Bốn: giữ ảnh cũ cho tới khi bản mới chạy ổn định vài lần khởi động. Năm: chống hạ phiên bản bằng eFuse. Sáu: đo dung lượng flash đã dùng, giữ dưới <code>80</code> phần trăm để còn chỗ cho gói 180 KB. Bảy: thử mất điện giữa lúc ghi ít nhất mười lần.",
        focus: "all",
        edges: "all",
        metrics: { flashKB: "512", usedPct: "78", otaSizeKB: "180", ok: "đạt" },
        changes: [
          "Toàn bộ luồng cập nhật đi qua kiểm chữ ký và ghi sang vùng B.",
          "Có phép thử mất điện và giới hạn dung lượng flash đã dùng."
        ],
        note: "Cập nhật an toàn là cập nhật có đường quay lui đã được thử."
      }
    ]
  };

  T.practice.push({
    id: "p-dong-co",
    tag: "REALTIME",
    module: "he-thong-nhung",
    tags: ["REALTIME", "ngắt", "5 ms"],
    title: "Động cơ ba pha trễ hạn 5 ms",
    scenario: "Một xưởng sản xuất dùng bo mạch STM32F4 điều khiển động cơ ba pha trong dây chuyền đóng gói. Vòng điều khiển cần phản hồi trong 5 ms để giữ dòng pha ổn định, nhưng hàm ngắt hiện tại đọc ADC, tính PID số thực, ghi log UART và chạy mất 8 ms. Máy hiện sóng cho thấy các lần ngắt xếp chồng, động cơ rung và nóng sau mười phút chạy. Nhóm kỹ thuật được yêu cầu sửa trong hai ngày, không đổi phần cứng, vẫn giữ nguyên tần số PWM và vẫn phải ghi log để truy lỗi. Bạn chọn cách nào?",
    metrics: [
      { label: "Chu kỳ điều khiển", value: "5 ms", danger: true },
      { label: "Hàm ngắt", value: "8 ms", danger: true },
      { label: "Phần cứng", value: "giữ nguyên" }
    ],
    options: [
      "Tăng xung nhịp lên 168 MHz để hàm ngắt chạy nhanh hơn",
      "Giữ nguyên ngắt nhưng giảm tần số PWM xuống 100 Hz",
      "Tách tính PID và ghi log ra vòng chính, ngắt chỉ đọc ADC và đặt duty dưới 1 ms",
      "Chuyển toàn bộ điều khiển sang một lõi phụ chạy hệ điều hành đầy đủ"
    ],
    correct: 2,
    explain: "Đáp án đúng là tách việc nặng ra khỏi ngắt. Hàm ngắt chỉ nên đọc mẫu ADC và ghi thanh ghi duty, khoảng 0,8 ms, rồi đặt cờ cho vòng chính. Vòng chính tính PID và ghi log, chấp nhận trễ vài chu kỳ vì các việc đó không cần đúng hạn 5 ms. Tăng xung nhịp không cứu được vì 8 ms chủ yếu là chờ UART, không phải tính toán. Giảm tần số PWM xuống 100 Hz làm chu kỳ thành 10 ms, phá yêu cầu 5 ms và gây tiếng ù. Đưa hệ điều hành đầy đủ vào chỉ thêm jitter, không bảo đảm hạn."
  });

  T.practice.push({
    id: "p-lo-phan-ung",
    tag: "SENSOR",
    module: "he-thong-nhung",
    tags: ["SENSOR", "Nyquist", "ADC"],
    title: "Lò phản ứng lấy mẫu 1 Hz",
    scenario: "Một nhà máy hóa chất giám sát nhiệt độ lò phản ứng bằng cảm biến PT100 nối với ADC 12 bit của một vi điều khiển. Hệ thống hiện lấy mẫu 1 Hz và ghi log mỗi giây một lần để tiết kiệm pin cho trạm đo từ xa. Tuần trước, một van làm mát kẹt trong 0,4 giây khiến nhiệt độ vọt lên 40 độ C trên ngưỡng an toàn, nhưng biểu đồ vẫn phẳng vì không có mẫu nào rơi vào lúc đó. Không ai phát hiện cho tới khi nhân viên đi ca kiểm tra. Bạn được giao chọn lại tần số lấy mẫu và cách cảnh báo.",
    metrics: [
      { label: "Tần số cũ", value: "1 Hz", danger: true },
      { label: "Sự kiện cần bắt", value: "0,4 giây" },
      { label: "ADC", value: "12 bit" }
    ],
    options: [
      "Giữ 1 Hz nhưng tăng độ phân giải ADC lên 16 bit",
      "Nâng lên 20 Hz, lọc trung bình 8 mẫu, thêm ngắt cảnh báo cứng khi vượt ngưỡng",
      "Nâng lên 2 Hz vì đã gấp đôi tần số cũ",
      "Bỏ ADC, đọc cảm biến qua I2C mỗi 10 giây để giảm nhiễu"
    ],
    correct: 1,
    explain: "Định lý lấy mẫu yêu cầu tần số lớn hơn hai lần thành phần nhanh nhất. Sự kiện 0,4 giây tương ứng khoảng 2,5 Hz, nên 1 Hz và 2 Hz đều bỏ lỡ. Chọn 20 Hz, gấp tám lần, vừa thỏa định lý vừa có biên cho nhiễu và bộ lọc. Lọc trung bình 8 mẫu làm mượt nhưng không che được sự kiện dài 0,4 giây, tức khoảng 8 mẫu. Thêm một ngắt so sánh ngưỡng cứng, không qua lọc, để báo động tức thì. Tăng bit ADC chỉ giảm sai số lượng tử, không giúp thấy sự kiện bị bỏ lỡ. Đọc I2C mỗi 10 giây còn tệ hơn."
  });

  T.cheatsheets.push({
    id: "embedded",
    num: "03",
    module: "he-thong-nhung",
    title: "Bảng tra hệ nhúng",
    intro: "Bảng tra cho người làm firmware: chọn vi điều khiển theo nhiệm vụ, đổi số ADC ra đơn vị thật, tính ngân sách thời gian thực, cập nhật OTA an toàn và giữ pin lâu. Mỗi thẻ là một bảng hoặc checklist ngắn.",
    cards: [
      {
        title: "Chọn vi điều khiển",
        wide: true,
        html: '<table class="cheat-table"><thead><tr><th>Nhu cầu</th><th>Cấu hình đủ dùng</th><th>Dấu hiệu cần lên đời</th></tr></thead><tbody><tr><td>Bật tắt, đọc nút</td><td class="mono">Cortex-M0+, 32 KB RAM, 48 MHz</td><td>Thiếu chân hoặc cần USB</td></tr><tr><td>Điều khiển động cơ</td><td class="mono">M3/M4, 64 KB RAM, 2 bộ định thời</td><td>PID số thực chiếm quá 50% CPU</td></tr><tr><td>Đo và ghi log nhiều kênh</td><td class="mono">ADC 12 bit, DMA, 128 KB flash</td><td>Cần lọc tín hiệu phức tạp</td></tr><tr><td>Giao tiếp không dây</td><td class="mono">M4 có radio, 256 KB flash</td><td>Cần mã hóa TLS tại chỗ</td></tr></tbody></table>'
      },
      {
        title: "Đổi số đọc ADC",
        html: '<div style="margin-top:10px;overflow-x:auto"><pre><code>V = raw / 4095 * 3.3    // ADC 12 bit\nnhiet_do = (V - 0.5) * 100\n// 0.5 V = 0 do C, 10 mV moi do\n// 4096 muc, moi muc 0.8 mV</code></pre></div><p>Đọc datasheet để biết điện áp tham chiếu thật; đừng mặc định là 3,3 V.</p>'
      },
      {
        title: "Ngân sách thời gian thực",
        wide: true,
        html: '<div style="margin-top:10px;overflow-x:auto"><pre><code>chu_ky        = 5 ms\nngat_doc_mau  &lt;= 1 ms   // 20% chu ky\nvong_chinh    &lt;= 3 ms   // tinh PID, loc\njitter        &lt;= 0,5 ms // 10% chu ky\nUART 115200: 10 byte ~ 0,87 ms</code></pre></div><p>Tính ngân sách từ hạn phản hồi, không từ tốc độ CPU. Việc gì không cần đúng hạn thì đẩy ra vòng chính.</p>'
      },
      {
        title: "Quy trình cập nhật firmware",
        html: '<ul style="margin-top:9px;padding-left:16px;font-size:.7rem;line-height:1.55;color:var(--text-soft)"><li>Tải gói vào vùng đệm, kiểm mã thiết bị và phiên bản.</li><li>Tính mã băm, kiểm chữ ký bằng khóa công khai trong bootloader.</li><li>Ghi sang vùng B, đọc lại và so sánh từng trang.</li><li>Đặt cờ khởi động, khởi động lại, chạy thử.</li><li>Chỉ xóa ảnh A sau khi bản B chạy ổn ba lần.</li></ul>'
      },
      {
        title: "Checklist tiết kiệm pin",
        html: '<ul style="margin-top:9px;padding-left:16px;font-size:.7rem;line-height:1.55;color:var(--text-soft)"><li>Tắt ngoại vi không dùng, kể cả ADC và UART.</li><li>Ngủ sâu giữa các lần đo, đánh thức bằng ngắt.</li><li>Giảm xung nhịp khi chỉ cần đếm chậm.</li><li>Gộp lần gửi dữ liệu thay vì gửi từng mẫu.</li><li>Đo dòng ở chế độ ngủ bằng đồng hồ vạn năng.</li></ul>'
      }
    ]
  });
})();
