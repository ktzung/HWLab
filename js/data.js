/* HWLab — dữ liệu bài học phần cứng máy tính */
window.HWLAB = window.HWLAB || { modules: [], lessons: {}, practice: [], cheatsheets: [] };
(function () {
  const DB = window.HWLAB;

  DB.modules.push({
    id: "cau-tao-may",
    num: "01",
    title: "Cấu tạo máy",
    tone: "blue",
    blurb: "Máy tính chỉ nhanh bằng chỗ hẹp nhất của nó. Bốn bài đi từ nhân CPU và xung nhịp, qua bộ nhớ chính, bus truyền dữ liệu, đến thiết bị vào ra. Mỗi bài có sơ đồ, phép tính và tình huống thật để đọc thông số cấu hình mà không bị đánh lừa.",
    lessons: ["cpu", "memory", "bus", "io"]
  });

  DB.lessons["cpu"] = {
    id: "cpu",
    module: "cau-tao-may",
    title: "CPU và xung nhịp",
    shortTitle: "CPU, xung nhịp",
    subtitle: "Nhân, luồng, CPI và thời gian chạy",
    blurb: "Xung nhịp không phải cả câu chuyện. Bài này tách ba đại lượng: số lõi, số luồng và CPI, rồi ghép lại thành công thức thời gian chạy. Để thấy vì sao máy tám lõi vẫn chậm khi phần mềm chỉ dùng một lõi.",
    duration: "12 phút",
    level: "Cơ bản",
    tags: ["nhân CPU", "luồng", "xung nhịp", "CPI", "song song"],
    metrics: [
      { key: "cores", label: "Số lõi", tone: "blue" },
      { key: "clockGHz", label: "Xung nhịp", tone: "mint" },
      { key: "cpi", label: "CPI", tone: "yellow" },
      { key: "ok", label: "Lõi dùng được", tone: "coral" }
    ],
    nodes: [
      { id: "app", type: "user", x: 55, y: 80, w: 200, h: 70, label: "Chương trình", sub: "một tỉ lệnh" },
      { id: "thread", type: "task", x: 340, y: 80, w: 200, h: 70, label: "Luồng chính", sub: "chạy tuần tự" },
      { id: "clock", type: "clock", x: 625, y: 80, w: 200, h: 70, label: "Xung 3 GHz", sub: "ba tỉ chu kỳ mỗi giây" },
      { id: "core", type: "server", x: 55, y: 310, w: 200, h: 70, label: "Một nhân bận", sub: "bảy nhân còn trống" },
      { id: "cpi", type: "grid", x: 340, y: 310, w: 200, h: 70, label: "CPI 2,0", sub: "hai chu kỳ mỗi lệnh" },
      { id: "time", type: "event", x: 625, y: 310, w: 200, h: 70, label: "Thời gian chạy", sub: "0,67 giây" },
      { id: "limit", type: "alert", x: 340, y: 195, w: 200, h: 70, label: "Giới hạn song song", sub: "phần mềm không chia việc" }
    ],
    edges: [
      { id: "app-thread", from: "app", to: "thread", kind: "request", label: "nộp chương trình" },
      { id: "thread-core", from: "thread", to: "core", kind: "request", label: "giao việc" },
      { id: "clock-core", from: "clock", to: "core", kind: "control", label: "nhịp ba GHz" },
      { id: "core-cpi", from: "core", to: "cpi", kind: "data", label: "chu kỳ mỗi lệnh" },
      { id: "cpi-time", from: "cpi", to: "time", kind: "data", label: "tính thời gian" },
      { id: "thread-limit", from: "thread", to: "limit", kind: "control", label: "chỉ một luồng" },
      { id: "limit-time", from: "limit", to: "time", kind: "control", label: "chặn tăng tốc" }
    ],
    learn: [
      "<strong>Xung nhịp</strong> là số chu kỳ mỗi giây, 3 GHz là ba tỉ chu kỳ.",
      "<strong>CPI</strong> là số chu kỳ trung bình để hoàn thành một lệnh.",
      "Thời gian chạy bằng <code>số lệnh × CPI ÷ xung nhịp</code>.",
      "Tăng xung chỉ giúp khi CPI và mức song song không bị chặn."
    ],
    steps: [
      {
        short: "Ba đại lượng",
        type: "concept",
        title: "Xung nhịp, CPI và số lõi",
        body: "Ba đại lượng quyết định tốc độ: số lõi, xung nhịp và CPI. Xung nhịp 3 GHz nghĩa là mỗi giây có ba tỉ chu kỳ; CPI là số chu kỳ trung bình cho một lệnh. Một chương trình một tỉ lệnh, CPI 2,0, chạy trên lõi 3 GHz sẽ mất <code>1e9 × 2 ÷ 3e9 = 0,67 giây</code>. Con số này là mốc để so sánh mọi thay đổi về sau. Muốn nhanh hơn, ta có ba hướng: giảm số lệnh, giảm CPI, hoặc tăng xung. Mỗi hướng đều có giới hạn riêng, và bài này đi qua từng hướng một.",
        focus: ["app", "thread", "core", "cpi", "time"],
        edges: ["app-thread", "thread-core", "cpi-time"],
        metrics: { cores: "8", clockGHz: "3,0 GHz", cpi: "2,0", ok: "1 lõi" },
        changes: [
          "Chương trình một tỉ lệnh được quy về một con số thời gian cụ thể.",
          "Ba hướng tối ưu được tách bạch thay vì gộp chung vào xung nhịp."
        ],
        note: "Luôn quy mọi so sánh về cùng một công thức trước khi kết luận."
      },
      {
        short: "Nhân và luồng",
        type: "flow",
        title: "Tám lõi nhưng chỉ một luồng",
        body: "Máy có tám lõi, nhưng phần mềm chỉ tạo một luồng tính toán nên bảy lõi đứng yên. Hệ điều hành có thể đổi lõi cho luồng đó, nhưng tại mỗi thời điểm vẫn chỉ một lõi làm việc. Muốn dùng hết tám lõi, chương trình phải chia bài toán thành các phần độc lập chạy song song. Đây là giới hạn của phần mềm, không phải của chip. Vì vậy tăng xung từ 3 lên 4 GHz chỉ rút thời gian từ 0,67 xuống 0,5 giây, trong khi chia đều cho tám lõi có thể xuống dưới 0,1 giây nếu bài toán cho phép.",
        focus: ["thread", "core", "limit", "clock"],
        edges: ["thread-core", "thread-limit", "clock-core"],
        metrics: { cores: "8", clockGHz: "3,0 GHz", cpi: "2,0", ok: "1 lõi" },
        changes: [
          "Bảy lõi ở trạng thái nghỉ dù máy vẫn được quảng cáo tám lõi.",
          "Nút thắt được xác định là phần mềm, không phải xung nhịp."
        ],
        note: "Số lõi chỉ có giá trị khi tác vụ chia được thành nhiều phần."
      },
      {
        short: "Tính thời gian",
        type: "detail",
        title: "Tăng xung 3 lên 4 GHz",
        body: "Giữ nguyên một tỉ lệnh và CPI 2,0, nâng xung từ 3 lên 4 GHz cho thời gian <code>1e9 × 2 ÷ 4e9 = 0,5 giây</code>, tức nhanh hơn khoảng 25 phần trăm. Đó là mức tăng thực tế của một lần đổi xung, không phải gấp đôi. Nếu đồng thời giảm CPI từ 2,0 xuống 1,5, thời gian còn 0,375 giây. Còn nếu chia việc cho tám lõi đều nhau, mỗi lõi nhận 125 triệu lệnh và thời gian lý thuyết chỉ khoảng 0,083 giây. Ba con số này cho thấy thứ tự ưu tiên: song song trước, CPI sau, xung cuối.",
        focus: ["clock", "core", "cpi", "time"],
        edges: ["clock-core", "core-cpi", "cpi-time"],
        metrics: { cores: "8", clockGHz: "4,0 GHz", cpi: "2,0", ok: "1 lõi" },
        changes: [
          "Thời gian giảm từ 0,67 xuống 0,5 giây khi tăng xung.",
          "Chia đều tám lõi đưa thời gian lý thuyết xuống khoảng 0,083 giây."
        ],
        note: "Tăng xung 33 phần trăm chỉ cho khoảng 25 phần trăm thời gian."
      },
      {
        short: "CPI thực tế",
        type: "pitfall",
        title: "CPI không đứng yên",
        body: "CPI trong công thức là giá trị trung bình, và nó thay đổi theo chương trình. Khi dữ liệu không có trong cache, CPU phải chờ bộ nhớ, mỗi lần trượt có thể tốn hàng trăm chu kỳ, kéo CPI từ 2,0 lên 3,5 hoặc hơn. Lúc đó tăng xung chỉ rút ngắn phần tính toán, còn phần chờ vẫn nguyên. Một lỗi thường gặp là so sánh hai máy chỉ bằng con số GHz in trên hộp, bỏ qua kiến trúc, cache và CPI. Hãy đo trên chính chương trình của mình, cùng dữ liệu, cùng phiên bản, rồi mới kết luận máy nào nhanh hơn.",
        focus: ["cpi", "core", "time", "limit"],
        edges: ["core-cpi", "cpi-time", "limit-time"],
        metrics: { cores: "8", clockGHz: "4,0 GHz", cpi: "3,5", ok: "1 lõi" },
        changes: [
          "CPI tăng từ 2,0 lên 3,5 do chờ bộ nhớ, xóa phần lợi của xung.",
          "Tiêu chí so sánh chuyển từ GHz sang thời gian đo thật."
        ],
        note: "CPI là số đo của chương trình, không phải hằng số của chip."
      },
      {
        short: "Chọn cách tăng tốc",
        type: "final",
        title: "Thứ tự ưu tiên khi máy chậm",
        tone: "final",
        body: "Chốt lại thành thứ tự kiểm tra. Một: xem phần mềm có chia việc cho nhiều lõi không, nếu không thì tám lõi cũng như một. Hai: đo CPI thực tế, tìm xem thời gian mất ở tính toán hay ở chờ bộ nhớ. Ba: nếu mất ở chờ, xử lý cache, dữ liệu và ổ đĩa trước khi nghĩ đến xung. Bốn: chỉ khi ba bước trên đã ổn, tăng xung hoặc đổi CPU mới có ý nghĩa. Năm: đo lại sau mỗi thay đổi bằng cùng một bài thử. Với ví dụ trong bài, chia đều tám lõi đưa thời gian từ 0,67 xuống 0,083 giây, còn tăng xung chỉ xuống 0,5 giây.",
        focus: "all",
        edges: "all",
        metrics: { cores: "8", clockGHz: "4,0 GHz", cpi: "2,0", ok: "8 lõi" },
        changes: [
          "Cả tám lõi tham gia, thời gian lý thuyết còn khoảng 0,083 giây.",
          "Kết luận dựa trên phép đo, không dựa trên nhãn GHz."
        ],
        note: "Phần mềm song song là món quà lớn nhất, và nó miễn phí."
      }
    ]
  };

  DB.lessons["memory"] = {
    id: "memory",
    module: "cau-tao-may",
    title: "Bộ nhớ chính",
    shortTitle: "Bộ nhớ chính",
    subtitle: "Dung lượng, băng thông và độ trễ",
    blurb: "RAM giữ dữ liệu đang dùng, nhưng không phải lúc nào cũng nhanh như quảng cáo. Bài này phân biệt dung lượng, băng thông và độ trễ, rồi chỉ ra vì sao thêm thanh RAM không làm một lần truy cập nhanh hơn.",
    duration: "12 phút",
    level: "Cơ bản",
    tags: ["RAM", "cache", "băng thông", "độ trễ", "DRAM"],
    metrics: [
      { key: "capacityGB", label: "Dung lượng", tone: "blue" },
      { key: "bandwidthGBs", label: "Băng thông", tone: "mint" },
      { key: "latencyNs", label: "Độ trễ", tone: "yellow" },
      { key: "ok", label: "Mức đáp ứng", tone: "coral" }
    ],
    nodes: [
      { id: "cpu", type: "server", x: 55, y: 80, w: 200, h: 70, label: "CPU", sub: "cần dữ liệu ngay" },
      { id: "cache", type: "layers", x: 340, y: 80, w: 200, h: 70, label: "Cache L3", sub: "32 MB, 12 ns" },
      { id: "ctrl", type: "code", x: 625, y: 80, w: 200, h: 70, label: "Bộ điều khiển", sub: "chọn hàng, chọn cột" },
      { id: "dimm", type: "memory", x: 55, y: 310, w: 200, h: 70, label: "Thanh RAM", sub: "16 GB DDR4" },
      { id: "bw", type: "signal", x: 340, y: 310, w: 200, h: 70, label: "Băng thông", sub: "51,2 GB/s hai kênh" },
      { id: "lat", type: "clock", x: 625, y: 310, w: 200, h: 70, label: "Độ trễ", sub: "80 ns mỗi lần trượt" },
      { id: "miss", type: "alert", x: 340, y: 195, w: 200, h: 70, label: "Trượt cache", sub: "cứ 20 lần một lần" }
    ],
    edges: [
      { id: "cpu-cache", from: "cpu", to: "cache", kind: "request", label: "đọc 64 byte" },
      { id: "cache-miss", from: "cache", to: "miss", kind: "control", label: "không có dữ liệu" },
      { id: "miss-ctrl", from: "miss", to: "ctrl", kind: "request", label: "xin nạp từ RAM" },
      { id: "ctrl-dimm", from: "ctrl", to: "dimm", kind: "request", label: "mở hàng, cột" },
      { id: "dimm-bw", from: "dimm", to: "bw", kind: "data", label: "luồng byte" },
      { id: "bw-lat", from: "bw", to: "lat", kind: "data", label: "thời gian chờ" },
      { id: "lat-cpu", from: "lat", to: "cpu", kind: "response", label: "nạp vào thanh ghi" }
    ],
    learn: [
      "<strong>Dung lượng</strong> quyết định chứa được bao nhiêu, không quyết định nhanh hay chậm.",
      "<strong>Băng thông</strong> là số byte mỗi giây, hợp với luồng dữ liệu lớn.",
      "<strong>Độ trễ</strong> là thời gian chờ một lần truy cập, tính bằng nano giây.",
      "Cache nhanh hơn DRAM hàng chục lần nhưng chỉ vài chục MB."
    ],
    steps: [
      {
        short: "Ba tầng bộ nhớ",
        type: "concept",
        title: "Cache, DRAM và ổ đĩa",
        body: "Bộ nhớ chia tầng theo tốc độ và giá. Cache L3 khoảng 32 MB, truy cập 12 ns; thanh RAM 16 GB, truy cập khoảng 80 ns; ổ SSD 0,1 ms, tức 100.000 ns. Mỗi tầng chậm hơn nhưng rẻ và lớn hơn tầng trước. CPU luôn hỏi cache trước, chỉ khi trượt mới xuống RAM. Vì 80 ns gấp gần bảy lần 12 ns, tỉ lệ trượt cache ảnh hưởng mạnh đến hiệu năng. Ba chỉ số cần nhớ là dung lượng, băng thông và độ trễ; chúng độc lập với nhau và không thay thế nhau.",
        focus: ["cpu", "cache", "dimm", "lat"],
        edges: ["cpu-cache", "ctrl-dimm", "lat-cpu"],
        metrics: { capacityGB: "16 GB", bandwidthGBs: "51,2 GB/s", latencyNs: "80 ns", ok: "Đủ" },
        changes: [
          "Ba tầng bộ nhớ được đặt cạnh nhau theo cùng đơn vị nano giây.",
          "Vai trò của cache và RAM được tách rõ ràng."
        ],
        note: "Dung lượng lớn không làm độ trễ giảm; hai chỉ số khác nhau."
      },
      {
        short: "Một lần đọc",
        type: "flow",
        title: "Đường đi của một lần đọc",
        body: "Khi CPU cần một biến, nó gửi địa chỉ tới cache. Nếu có, dữ liệu về sau 12 ns. Nếu trượt, bộ điều khiển bộ nhớ mở đúng hàng và cột trên thanh RAM, đọc cả dòng cache 64 byte dù chương trình chỉ cần 4 byte. Một lần trượt tốn khoảng 80 ns, tức khoảng 240 chu kỳ ở 3 GHz. Với tỉ lệ trượt 5 phần trăm, thời gian trung bình mỗi truy cập là <code>0,95 × 12 + 0,05 × 80 = 15,4 ns</code>. Con số 15,4 ns này là thứ quyết định tốc độ thực, không phải 12 ns in trên tài liệu.",
        focus: ["cpu", "cache", "miss", "ctrl", "lat"],
        edges: ["cpu-cache", "cache-miss", "miss-ctrl", "lat-cpu"],
        metrics: { capacityGB: "16 GB", bandwidthGBs: "51,2 GB/s", latencyNs: "15,4 ns", ok: "Đủ" },
        changes: [
          "Mỗi lần trượt kéo theo việc đọc cả dòng 64 byte.",
          "Độ trễ trung bình 15,4 ns thay cho con số 12 ns lý thuyết."
        ],
        note: "Dòng cache 64 byte là lý do truy cập tuần tự nhanh hơn nhảy cóc."
      },
      {
        short: "Băng thông",
        type: "detail",
        title: "51,2 GB/s đến từ đâu",
        body: "Băng thông RAM tính theo số lần truyền mỗi giây nhân số byte mỗi lần. DDR4-3200 truyền 3.200 triệu lần mỗi giây, bus rộng 64 bit tức 8 byte, nên một kênh đạt <code>3200 × 8 = 25.600 MB/s</code>, khoảng 25,6 GB/s. Cắm hai kênh song song thì tổng là 51,2 GB/s. Đây là con số lý thuyết, thực tế thường thấp hơn 10 đến 20 phần trăm vì thời gian chờ và tranh chấp. Băng thông lớn giúp ích khi copy tệp, dựng video hoặc chạy nhiều luồng cùng đọc dữ liệu lớn. Với tác vụ lẻ, độ trễ quan trọng hơn.",
        focus: ["dimm", "bw", "ctrl"],
        edges: ["ctrl-dimm", "dimm-bw", "bw-lat"],
        metrics: { capacityGB: "16 GB", bandwidthGBs: "51,2 GB/s", latencyNs: "80 ns", ok: "Dư" },
        changes: [
          "Một kênh cho 25,6 GB/s, hai kênh cộng lại thành 51,2 GB/s.",
          "Băng thông được nối rõ với số byte mỗi lần truyền."
        ],
        note: "Cắm hai thanh vào đúng hai khe cùng màu mới bật được hai kênh."
      },
      {
        short: "Dung lượng và trễ",
        type: "pitfall",
        title: "Thêm RAM không giảm độ trễ",
        body: "Một hiểu nhầm phổ biến là thêm thanh RAM sẽ làm máy nhanh hơn ở mọi tác vụ. Thực tế, dung lượng chỉ giúp khi máy thiếu chỗ và phải dùng swap trên ổ đĩa; lúc đó độ trễ nhảy từ 80 ns lên hàng trăm micro giây. Nếu máy đã đủ 16 GB cho công việc, cắm thêm 16 GB không làm một lần đọc nhanh hơn. Ngược lại, chạy hai kênh có thể tăng băng thông gấp đôi với cùng dung lượng. Hãy xem biểu đồ sử dụng RAM trước khi mua, và ưu tiên đúng khe, đúng thế hệ, đúng tốc độ mà bo mạch hỗ trợ.",
        focus: ["dimm", "lat", "bw", "miss"],
        edges: ["dimm-bw", "bw-lat", "cache-miss"],
        metrics: { capacityGB: "16 GB", bandwidthGBs: "25,6 GB/s", latencyNs: "80 ns", ok: "Thiếu" },
        changes: [
          "Một kênh duy nhất làm băng thông giảm còn 25,6 GB/s.",
          "Thiếu RAM đẩy dữ liệu xuống swap, độ trễ tăng hàng nghìn lần."
        ],
        note: "Độ trễ do công nghệ quyết định, không do số thanh RAM."
      },
      {
        short: "Checklist chọn RAM",
        type: "final",
        title: "Chọn RAM theo nhu cầu",
        tone: "final",
        body: "Chốt lại bằng checklist ngắn. Một: ước lượng dung lượng theo phần mềm, 16 GB đủ cho học tập và văn phòng, 32 GB cho dựng video. Hai: cắm hai thanh giống nhau vào hai kênh để có 51,2 GB/s thay vì 25,6 GB/s. Ba: kiểm tra bo mạch hỗ trợ DDR4 hay DDR5 và tốc độ tối đa. Bốn: đừng mua RAM nhanh hơn mức bo mạch chạy được. Năm: theo dõi tỉ lệ trượt cache và mức dùng RAM bằng công cụ đo. Sáu: nhớ rằng độ trễ 80 ns là đặc điểm của DRAM, muốn nhanh hơn phải dựa vào cache và thuật toán truy cập tuần tự.",
        focus: "all",
        edges: "all",
        metrics: { capacityGB: "32 GB", bandwidthGBs: "51,2 GB/s", latencyNs: "80 ns", ok: "Dư" },
        changes: [
          "Cấu hình chốt ở 32 GB, hai kênh, đúng thế hệ bo mạch.",
          "Tiêu chí mua dựa trên nhu cầu thật và số đo, không theo quảng cáo."
        ],
        note: "Truy cập tuần tự tận dụng dòng cache 64 byte tốt hơn nhảy ngẫu nhiên."
      }
    ]
  };

  DB.lessons["bus"] = {
    id: "bus",
    module: "cau-tao-may",
    title: "Bus và kênh truyền",
    shortTitle: "Bus, kênh truyền",
    subtitle: "Độ rộng, tần số và băng thông",
    blurb: "Một bus hẹp làm nghẽn cả hệ thống dù CPU và RAM đều mạnh. Bài này tính băng thông từ độ rộng và tần số, so với nhu cầu của card mạng, rồi chỉ cách chọn kênh và chia tải để tránh hàng đợi.",
    duration: "12 phút",
    level: "Trung cấp",
    tags: ["bus", "băng thông", "độ rộng", "tần số", "nghẽn"],
    metrics: [
      { key: "widthBits", label: "Độ rộng bus", tone: "blue" },
      { key: "freqMHz", label: "Tần số", tone: "mint" },
      { key: "throughputGBs", label: "Băng thông", tone: "yellow" },
      { key: "ok", label: "Mức tải", tone: "coral" }
    ],
    nodes: [
      { id: "cpu", type: "server", x: 55, y: 80, w: 200, h: 70, label: "CPU", sub: "cần dữ liệu nhanh" },
      { id: "bus", type: "grid", x: 340, y: 80, w: 200, h: 70, label: "Bus 64 bit", sub: "1.600 MHz" },
      { id: "ram", type: "memory", x: 625, y: 80, w: 200, h: 70, label: "RAM", sub: "cấp dữ liệu" },
      { id: "nic", type: "api", x: 55, y: 310, w: 200, h: 70, label: "Card mạng", sub: "cần 25 GB/s" },
      { id: "ssd", type: "disk", x: 340, y: 310, w: 200, h: 70, label: "Ổ NVMe", sub: "dùng chung bus" },
      { id: "meter", type: "clock", x: 625, y: 310, w: 200, h: 70, label: "Băng thông đo được", sub: "12,8 GB/s" },
      { id: "jam", type: "alert", x: 340, y: 195, w: 200, h: 70, label: "Nghẽn bus", sub: "nhiều thiết bị tranh nhau" }
    ],
    edges: [
      { id: "cpu-bus", from: "cpu", to: "bus", kind: "request", label: "đọc và ghi" },
      { id: "bus-ram", from: "bus", to: "ram", kind: "data", label: "8 byte mỗi nhịp" },
      { id: "nic-bus", from: "nic", to: "bus", kind: "request", label: "gói tin đến" },
      { id: "ssd-bus", from: "ssd", to: "bus", kind: "data", label: "khối dữ liệu" },
      { id: "bus-meter", from: "bus", to: "meter", kind: "data", label: "đo lưu lượng" },
      { id: "bus-jam", from: "bus", to: "jam", kind: "control", label: "tranh chấp" },
      { id: "jam-meter", from: "jam", to: "meter", kind: "control", label: "làm giảm tốc" }
    ],
    learn: [
      "Băng thông bằng <code>độ rộng × tần số ÷ 8</code>, đơn vị byte mỗi giây.",
      "Bus 64 bit, 1.600 MHz cho 12,8 GB/s, không phải 102,4 GB/s.",
      "Nhiều thiết bị dùng chung một bus thì phải xếp hàng.",
      "Card mạng 25 GB/s cần kênh riêng hoặc nhiều làn PCIe."
    ],
    steps: [
      {
        short: "Công thức",
        type: "concept",
        title: "Độ rộng nhân tần số",
        body: "Bus truyền dữ liệu theo nhịp, mỗi nhịp gửi được số bit bằng độ rộng bus. Với bus 64 bit chạy 1.600 MHz, mỗi giây có 1.600 triệu nhịp, mỗi nhịp 8 byte, nên băng thông là <code>64 × 1600 ÷ 8 = 12.800 MB/s</code>, tức 12,8 GB/s. Công thức chỉ đúng khi tính bằng đơn vị nhất quán: bit và MHz cho ra MB/s, chia thêm 1.000 để ra GB/s. Đây là mức tối đa lý thuyết, chưa trừ thời gian chờ và chu kỳ quản lý. Muốn tăng băng thông, chỉ có hai cách: mở rộng bus hoặc tăng tần số, mỗi cách đều có giới hạn vật lý.",
        focus: ["cpu", "bus", "ram", "meter"],
        edges: ["cpu-bus", "bus-ram", "bus-meter"],
        metrics: { widthBits: "64 bit", freqMHz: "1.600 MHz", throughputGBs: "12,8 GB/s", ok: "Vừa" },
        changes: [
          "Băng thông được tính ra 12,8 GB/s thay vì đoán theo tên bus.",
          "Hai cách tăng băng thông được xác định rõ."
        ],
        note: "Đổi bit sang byte bằng cách chia 8 trước khi so với nhu cầu."
      },
      {
        short: "Chia sẻ bus",
        type: "flow",
        title: "Ba thiết bị, một đường",
        body: "Bus hệ thống là đường dùng chung, nên CPU, card mạng và ổ NVMe phải thay phiên nhau gửi. Bộ trọng tài cấp quyền cho từng thiết bị theo lượt; thiết bị nào chờ lâu sẽ được ưu tiên. Khi card mạng cần 25 GB/s mà bus chỉ có 12,8 GB/s, nó chiếm gần hết băng thông, ổ NVMe và CPU phải xếp hàng. Hàng đợi dài dần, độ trễ tăng dù từng gói tin vẫn được gửi đúng. Đây là nghẽn cổ chai kinh điển: không thiết bị nào hỏng, chỉ là tổng nhu cầu vượt khả năng của một đường truyền.",
        focus: ["bus", "nic", "ssd", "jam"],
        edges: ["nic-bus", "ssd-bus", "bus-jam"],
        metrics: { widthBits: "64 bit", freqMHz: "1.600 MHz", throughputGBs: "12,8 GB/s", ok: "Nghẽn" },
        changes: [
          "Card mạng chiếm phần lớn băng thông, ổ NVMe phải chờ.",
          "Hàng đợi tại bus dài ra, độ trễ tăng dù không có lỗi."
        ],
        note: "Nghẽn xảy ra khi tổng nhu cầu vượt băng thông, không phải khi một thiết bị yếu."
      },
      {
        short: "Hai kênh",
        type: "detail",
        title: "Chọn kênh cho card mạng",
        body: "Có ba cách xử lý khi nhu cầu 25 GB/s vượt mức 12,8 GB/s. Cách một: dùng hai kênh song song, tổng 25,6 GB/s, vừa đủ nhưng không còn dư. Cách hai: đưa card mạng sang làn PCIe riêng, mỗi làn PCIe 4.0 khoảng 2 GB/s, cần tám làn để đạt 16 GB/s và mười sáu làn cho 32 GB/s. Cách ba: giảm nhu cầu bằng nén hoặc gộp gói. Trong thực tế, cách hai thường đúng nhất vì card mạng và ổ NVMe không còn tranh bus với RAM. Bài học là chọn kênh theo nhu cầu đo được, không theo thói quen cắm vào khe trống.",
        focus: ["bus", "nic", "meter", "jam"],
        edges: ["nic-bus", "bus-meter", "jam-meter"],
        metrics: { widthBits: "64 bit", freqMHz: "1.600 MHz, 2 kênh", throughputGBs: "25,6 GB/s", ok: "Vừa" },
        changes: [
          "Hai kênh nâng băng thông lên 25,6 GB/s, đủ cho card mạng.",
          "Phương án PCIe riêng được cân nhắc thay vì dồn chung một bus."
        ],
        note: "25,6 GB/s chỉ vừa đủ, không còn chỗ cho lưu lượng tăng đột biến."
      },
      {
        short: "Bốn lỗi tính",
        type: "pitfall",
        title: "MHz, MT/s và bit",
        body: "Bốn lỗi thường gặp khi tính băng thông. Thứ nhất, lẫn MHz với MT/s: DDR4-3200 chạy 1.600 MHz nhưng truyền 3.200 triệu lần mỗi giây, nên công thức phải dùng 3.200. Thứ hai, quên chia 8 vì bus tính bằng bit còn nhu cầu tính bằng byte, dẫn tới con số 102,4 GB/s sai gấp tám lần. Thứ ba, cộng băng thông các kênh khi chúng không chạy song song thật. Thứ tư, bỏ qua hao phí: băng thông thực thường thấp hơn lý thuyết 10 đến 20 phần trăm. Hãy ghi rõ đơn vị và kiểm tra lại phép chia trước khi kết luận hệ thống đủ hay thiếu.",
        focus: ["bus", "meter", "ram", "jam"],
        edges: ["bus-ram", "bus-meter", "bus-jam"],
        metrics: { widthBits: "64 bit", freqMHz: "1.600 MHz", throughputGBs: "12,8 GB/s", ok: "Nghẽn" },
        changes: [
          "Con số 102,4 GB/s bị loại bỏ vì sai đơn vị bit và byte.",
          "Băng thông thực được trừ hao phí 10 đến 20 phần trăm."
        ],
        note: "Ghi đơn vị ngay cạnh mỗi con số để tránh nhầm bit với byte."
      },
      {
        short: "Checklist kênh",
        type: "final",
        title: "Chọn kênh theo nhu cầu",
        tone: "final",
        body: "Chốt lại thành checklist. Một: liệt kê nhu cầu băng thông của từng thiết bị, card mạng 25 GB/s, ổ NVMe 7 GB/s, RAM 51,2 GB/s. Hai: tính băng thông từng kênh bằng độ rộng nhân tần số chia 8. Ba: so tổng nhu cầu với tổng khả năng, chừa 20 phần trăm dư. Bốn: đưa thiết bị có nhu cầu lớn nhất sang kênh riêng. Năm: đo lại bằng công cụ thực tế, không tin con số trên hộp. Sáu: ghi lại sơ đồ kênh để lần nâng cấp sau không cắm nhầm. Với ví dụ trong bài, bus 64 bit 1.600 MHz cho 12,8 GB/s, nên card mạng 25 GB/s bắt buộc phải có đường riêng.",
        focus: "all",
        edges: "all",
        metrics: { widthBits: "64 bit", freqMHz: "1.600 MHz", throughputGBs: "12,8 GB/s", ok: "Nghẽn" },
        changes: [
          "Sơ đồ kênh được ghi lại kèm nhu cầu từng thiết bị.",
          "Card mạng 25 GB/s được tách sang làn PCIe riêng."
        ],
        note: "Chừa 20 phần trăm dư là cách rẻ nhất để tránh nghẽn về sau."
      }
    ]
  };

  DB.lessons["io"] = {
    id: "io",
    module: "cau-tao-may",
    title: "Thiết bị vào ra",
    shortTitle: "Thiết bị vào ra",
    subtitle: "Ổ đĩa, bàn phím, mạng và ngắt",
    blurb: "Bàn phím, ổ đĩa và card mạng đều gửi ngắt về CPU, nhưng độ trễ khác nhau hàng nghìn lần. Bài này so mili giây với nano giây, xem hàng đợi ngắt đầy gây ra chuyện gì, và cách chọn thiết bị theo nhu cầu.",
    duration: "12 phút",
    level: "Cơ bản",
    tags: ["vào ra", "ngắt", "ổ đĩa", "độ trễ", "hàng đợi"],
    metrics: [
      { key: "devices", label: "Thiết bị", tone: "blue" },
      { key: "latencyMs", label: "Độ trễ", tone: "mint" },
      { key: "queueDepth", label: "Hàng đợi", tone: "yellow" },
      { key: "ok", label: "Mức trễ", tone: "coral" }
    ],
    nodes: [
      { id: "user", type: "user", x: 55, y: 80, w: 200, h: 70, label: "Người dùng", sub: "gõ phím, mở tệp" },
      { id: "kbd", type: "key", x: 340, y: 80, w: 200, h: 70, label: "Bàn phím", sub: "ngắt mỗi phím" },
      { id: "nic", type: "api", x: 625, y: 80, w: 200, h: 70, label: "Card mạng", sub: "gói đến liên tục" },
      { id: "ctrl", type: "code", x: 55, y: 310, w: 200, h: 70, label: "Bộ điều khiển ngắt", sub: "nhận và xếp hàng" },
      { id: "queue", type: "queue", x: 340, y: 310, w: 200, h: 70, label: "Hàng đợi ngắt", sub: "sâu 64 mục" },
      { id: "disk", type: "disk", x: 625, y: 310, w: 200, h: 70, label: "Ổ SSD", sub: "0,1 ms mỗi lệnh" },
      { id: "lag", type: "clock", x: 340, y: 195, w: 200, h: 70, label: "Độ trễ", sub: "ms so với ns" }
    ],
    edges: [
      { id: "kbd-ctrl", from: "kbd", to: "ctrl", kind: "request", label: "ngắt phím" },
      { id: "nic-ctrl", from: "nic", to: "ctrl", kind: "request", label: "ngắt mạng" },
      { id: "ctrl-queue", from: "ctrl", to: "queue", kind: "data", label: "đưa vào hàng" },
      { id: "queue-disk", from: "queue", to: "disk", kind: "request", label: "phục vụ lần lượt" },
      { id: "disk-user", from: "disk", to: "user", kind: "response", label: "dữ liệu trả về" },
      { id: "queue-lag", from: "queue", to: "lag", kind: "control", label: "thời gian chờ" },
      { id: "lag-user", from: "lag", to: "user", kind: "response", label: "phản hồi chậm" }
    ],
    learn: [
      "1 ms bằng một triệu ns, nên ổ đĩa chậm hơn RAM hàng nghìn lần.",
      "Ngắt báo cho CPU biết thiết bị cần xử lý, thay vì chờ đợi.",
      "Hàng đợi ngắt sâu giúp chịu tải nhưng làm tăng độ trễ.",
      "Gộp ngắt và DMA giảm số lần CPU phải dừng việc."
    ],
    steps: [
      {
        short: "Hai đơn vị",
        type: "concept",
        title: "Mili giây và nano giây",
        body: "Độ trễ thiết bị vào ra thường đo bằng mili giây, còn bộ nhớ đo bằng nano giây, và hai đơn vị cách nhau một triệu lần. RAM 80 ns, ổ SSD tốt 0,1 ms tức 100.000 ns, ổ cơ 5 ms tức 5.000.000 ns. Vì vậy một tác vụ chờ ổ đĩa tốn thời gian bằng hàng nghìn lần truy cập RAM. Bàn phím và chuột có độ trễ vài mili giây, đủ nhanh cho người dùng nhưng rất chậm so với CPU. Card mạng 10 GbE nhận hàng trăm nghìn gói mỗi giây, mỗi gói có thể sinh một ngắt. Hiểu đơn vị là bước đầu để biết chỗ nào đáng tối ưu.",
        focus: ["user", "kbd", "nic", "disk", "lag"],
        edges: ["kbd-ctrl", "nic-ctrl", "disk-user"],
        metrics: { devices: "3", latencyMs: "0,1 ms", queueDepth: "64", ok: "Vừa" },
        changes: [
          "Mọi độ trễ được quy về cùng đơn vị để so sánh.",
          "Ổ đĩa lộ ra là nguồn chờ lớn nhất trong ví dụ."
        ],
        note: "1 ms bằng 1.000.000 ns, con số này giải thích phần lớn cảm giác chậm."
      },
      {
        short: "Đường đi của ngắt",
        type: "flow",
        title: "Từ phím gõ đến màn hình",
        body: "Khi người dùng gõ một phím, bàn phím gửi tín hiệu, bộ điều khiển ngắt ghi nhận và đẩy một mục vào hàng đợi. CPU đang chạy chương trình khác sẽ tạm dừng, nhảy tới hàm xử lý ngắt, đọc mã phím rồi quay lại. Toàn bộ việc này mất vài micro giây, rất nhỏ so với 0,1 ms của ổ SSD. Vấn đề nằm ở số lượng: nếu card mạng sinh 800.000 ngắt mỗi giây, CPU gần như chỉ chạy hàm ngắt. Hàng đợi sâu 64 mục giúp không mất sự kiện, nhưng mục cuối phải chờ 63 mục trước, nên độ trễ tăng theo tải.",
        focus: ["kbd", "ctrl", "queue", "nic"],
        edges: ["kbd-ctrl", "nic-ctrl", "ctrl-queue"],
        metrics: { devices: "3", latencyMs: "0,1 ms", queueDepth: "64", ok: "Vừa" },
        changes: [
          "Mỗi lần ngắt buộc CPU dừng việc đang làm để xử lý.",
          "Hàng đợi sâu 64 giữ được sự kiện nhưng cộng dồn thời gian chờ."
        ],
        note: "Ngắt càng nhiều thì thời gian hữu ích của CPU càng ít."
      },
      {
        short: "Hàng đợi đầy",
        type: "detail",
        title: "Khi hàng đợi dài 64 mục",
        body: "Giả sử mỗi lệnh đọc ổ mất 0,1 ms và hàng đợi nhận 20.000 lệnh mỗi giây. Ổ chỉ phục vụ được 10.000 lệnh mỗi giây, nên mỗi giây dư 10.000 lệnh và hàng đợi đầy sau khoảng 6,4 mili giây. Khi đầy, lệnh mới bị từ chối hoặc chặn tiến trình gửi, và độ trễ thực tế bằng thời gian chờ cộng thời gian phục vụ. Với 64 mục phía trước, lệnh cuối chờ thêm <code>64 × 0,1 = 6,4 ms</code>. Con số này giải thích vì sao ổ nhanh vẫn có cảm giác chậm khi hệ thống quá tải. Giải pháp là tăng số ổ song song hoặc giảm số lệnh gửi dồn.",
        focus: ["queue", "disk", "lag", "ctrl"],
        edges: ["ctrl-queue", "queue-disk", "queue-lag"],
        metrics: { devices: "3", latencyMs: "6,5 ms", queueDepth: "64", ok: "Cao" },
        changes: [
          "Hàng đợi đầy sau khoảng 6,4 ms khi nhu cầu gấp đôi khả năng.",
          "Độ trễ thực tế tăng từ 0,1 ms lên khoảng 6,5 ms."
        ],
        note: "Hàng đợi chỉ che tải tạm thời, không tạo thêm băng thông."
      },
      {
        short: "Ngắt và thăm dò",
        type: "pitfall",
        title: "Bão ngắt và thăm dò",
        body: "Có hai cách biết thiết bị cần phục vụ: ngắt và thăm dò. Ngắt tiết kiệm CPU khi thiết bị rảnh, nhưng với thiết bị liên tục bận thì ngắt trở thành gánh nặng, gọi là bão ngắt. Thăm dò liên tục thì độ trễ thấp nhưng đốt CPU vô ích. Cách cân bằng là gộp ngắt: gom nhiều sự kiện rồi báo một lần, hoặc chuyển sang thăm dò khi lưu lượng cao. Ngoài ra, DMA cho phép thiết bị ghi thẳng vào RAM mà không cần CPU chép từng byte. Chọn sai cơ chế sẽ khiến CPU bận 100 phần trăm dù ổ đĩa chỉ chạy một nửa công suất.",
        focus: ["nic", "ctrl", "queue", "lag"],
        edges: ["nic-ctrl", "ctrl-queue", "queue-lag"],
        metrics: { devices: "3", latencyMs: "0,1 ms", queueDepth: "64", ok: "Cao" },
        changes: [
          "Gộp ngắt giảm số lần CPU phải dừng, giữ độ trễ ở mức chấp nhận.",
          "DMA chuyển việc chép dữ liệu từ CPU sang thiết bị."
        ],
        note: "Đo cả phần trăm CPU dành cho ngắt, không chỉ đo thời gian phản hồi."
      },
      {
        short: "Checklist thiết bị",
        type: "final",
        title: "Chọn thiết bị vào ra",
        tone: "final",
        body: "Chốt lại bằng checklist. Một: xác định độ trễ chấp nhận được, gõ phím dưới 30 ms, đọc tệp dưới 10 ms. Hai: chọn ổ SSD thay ổ cơ nếu cần độ trễ thấp, vì 0,1 ms khác 5 ms rất xa. Ba: kiểm tra hàng đợi và phần trăm CPU dành cho ngắt khi tải cao. Bốn: bật gộp ngắt và DMA cho card mạng, ổ NVMe. Năm: tách thiết bị nặng sang kênh riêng để không tranh bus. Sáu: đo lại bằng công cụ thật trên máy đích. Với ví dụ trong bài, hàng đợi 64 mục làm độ trễ từ 0,1 ms lên 6,5 ms, đủ để người dùng cảm nhận rõ.",
        focus: "all",
        edges: "all",
        metrics: { devices: "3", latencyMs: "0,1 ms", queueDepth: "16", ok: "Thấp" },
        changes: [
          "Hàng đợi hạ từ 64 xuống 16 mục, độ trễ chờ giảm bốn lần.",
          "Ngắt được gộp và DMA được bật cho thiết bị nặng."
        ],
        note: "Độ trễ thấp đến từ thiết bị phù hợp và hàng đợi ngắn, không từ CPU mạnh."
      }
    ]
  };

  DB.practice.push(
    {
      id: "cpu-mot-luong",
      module: "cau-tao-may",
      tag: "CPU",
      tags: ["CPU", "song song", "CPI"],
      title: "Tám lõi mà vẫn chậm",
      scenario: "Một máy tính tám lõi, xung 3,0 GHz, chạy phần mềm kế toán chỉ dùng một luồng. Người dùng thấy mỗi lần tính bảng lương mất 0,67 giây, bảy lõi còn lại gần như rảnh. Họ tăng xung lên 4,0 GHz và thời gian chỉ còn 0,5 giây, không phải 0,1 giây như mong đợi. Kỹ thuật viên đề xuất thêm RAM, đổi ổ SSD và cài lại hệ điều hành, nhưng các phép đo cho thấy dữ liệu nhỏ, nằm gọn trong cache. Câu hỏi đặt ra là nút thắt thật sự nằm ở đâu và nên sửa gì trước.",
      options: [
        "Ép xung lên 5,0 GHz và tăng điện áp cho CPU",
        "Sửa phần mềm để chia bảng lương thành tám phần chạy song song",
        "Cắm thêm 16 GB RAM để CPU không phải chờ dữ liệu",
        "Thay ổ SSD NVMe nhanh hơn và cài lại hệ điều hành"
      ],
      correct: 1,
      explain: "Đáp án đúng là chia việc cho nhiều lõi. Chương trình một luồng chỉ dùng một lõi, bảy lõi kia không tham gia, nên tăng xung chỉ rút thời gian theo đúng tỉ lệ 3 lên 4 GHz, tức khoảng 25 phần trăm, từ 0,67 xuống 0,5 giây. Nút thắt là mức song song của phần mềm, không phải phần cứng. Tăng xung thêm nữa gặp giới hạn nhiệt và điện, còn CPI vẫn 2,0. Thêm RAM vô ích vì dữ liệu đã nằm trong cache; đổi SSD cũng không giúp vì không có đọc tệp lớn. Muốn về 0,1 giây, phải sửa thuật toán để tám lõi cùng chạy.",
      metrics: [
        { label: "Số lõi", value: "8" },
        { label: "Thời gian", value: "0,67 giây" },
        { label: "Lõi bận", value: "1", danger: true }
      ]
    },
    {
      id: "bus-card-mang",
      module: "cau-tao-may",
      tag: "BUS",
      tags: ["bus", "băng thông", "PCIe"],
      title: "Card mạng 25 GB/s trên bus 12,8 GB/s",
      scenario: "Một máy trạm có bus 64 bit chạy 1.600 MHz, card mạng 25 Gb/s và ổ NVMe cùng cắm sau bus này. Khi sao lưu dữ liệu lên máy chủ, tốc độ chỉ đạt khoảng 9 GB/s dù card mạng và ổ đĩa đều mạnh. Kỹ thuật viên đo thấy bus đạt 12,8 GB/s, gần mức tối đa, trong khi card mạng cần 25 GB/s và ổ cần thêm 7 GB/s. Hàng đợi tại bộ điều khiển luôn đầy, độ trễ tăng gấp năm lần. Có ý kiến cho rằng nên tăng xung CPU, có ý kiến cho rằng nên mua RAM nhanh hơn. Cần chọn cách xử lý đúng bản chất nghẽn.",
      options: [
        "Tăng xung CPU lên 4,5 GHz để xử lý gói tin nhanh hơn",
        "Chuyển card mạng và ổ sang mười sáu làn PCIe riêng",
        "Đổi bus xuống 32 bit cho gọn và ít nhiễu hơn",
        "Cắm thêm RAM để bus tự mở rộng băng thông"
      ],
      correct: 1,
      explain: "Đáp án đúng là tách card mạng sang làn PCIe riêng. Bus 64 bit 1.600 MHz chỉ cho 12,8 GB/s, trong khi card mạng cần 25 GB/s và ổ cần 7 GB/s, tổng 32 GB/s, gấp 2,5 lần khả năng. Nghẽn nằm ở đường truyền dùng chung, nên tăng xung CPU không mở rộng được bus, còn RAM nhanh hơn cũng không giúp vì dữ liệu phải qua cùng một cửa. Đổi bus xuống 32 bit còn tệ hơn, chỉ 6,4 GB/s. Mười sáu làn PCIe 4.0 cho khoảng 32 GB/s, đủ cho cả card mạng và ổ. Sau khi tách kênh, hàng đợi ngắn lại và độ trễ giảm.",
      metrics: [
        { label: "Bus", value: "12,8 GB/s" },
        { label: "Nhu cầu", value: "32 GB/s" },
        { label: "Nghẽn", value: "2,5 lần", danger: true }
      ]
    }
  );

  DB.cheatsheets.push({
    id: "hardware-basics",
    num: "01",
    module: "cau-tao-may",
    title: "Bảng tra cấu tạo máy",
    intro: "Trang tra nhanh các con số thường gặp khi đọc cấu hình máy: bậc độ trễ của bộ nhớ và ổ đĩa, công thức băng thông bus, sơ đồ khối cơ bản và checklist chọn máy theo nhu cầu.",
    cards: [
      {
        title: "Bảng bậc độ trễ",
        wide: true,
        body: "<table><thead><tr><th>Bậc</th><th>Thiết bị</th><th>Độ trễ</th><th>Quy ra ns</th></tr></thead><tbody><tr><td>1</td><td>Cache L3</td><td>12 ns</td><td>12</td></tr><tr><td>2</td><td>RAM</td><td>80 ns</td><td>80</td></tr><tr><td>3</td><td>SSD NVMe</td><td>0,1 ms</td><td>100.000</td></tr><tr><td>4</td><td>Ổ cơ</td><td>5 ms</td><td>5.000.000</td></tr><tr><td>5</td><td>Mạng nội bộ</td><td>0,5 ms</td><td>500.000</td></tr></tbody></table>"
      },
      {
        title: "Công thức băng thông và thời gian",
        wide: true,
        body: "<pre><code>Băng thông = độ rộng (bit) x tần số (MHz) / 8\n           -> MB/s, chia 1.000 để ra GB/s\n\nBus 64 bit, 1.600 MHz:\n64 x 1600 / 8 = 12.800 MB/s = 12,8 GB/s\nHai kênh song song: 25,6 GB/s\n\nThời gian chạy = số lệnh x CPI / xung nhịp\n1e9 x 2,0 / 3e9 = 0,67 giây</code></pre>"
      },
      {
        title: "Sơ đồ khối CPU - RAM - vào ra",
        body: "<ul><li><strong>CPU</strong> đọc và ghi qua bus, hỏi cache trước.</li><li><strong>RAM</strong> nối với CPU bằng kênh bộ nhớ, nơi có độ trễ 80 ns.</li><li><strong>Vào ra</strong> gồm SSD, bàn phím, card mạng, báo việc qua ngắt.</li><li><strong>Bus</strong> là đường dùng chung, nhu cầu vượt băng thông thì nghẽn.</li></ul>"
      },
      {
        title: "Bảng đơn vị",
        body: "<table><thead><tr><th>Đơn vị</th><th>Quy đổi</th><th>Dùng cho</th></tr></thead><tbody><tr><td>ns</td><td>0,000000001 s</td><td>cache, RAM</td></tr><tr><td>micro giây</td><td>1.000 ns</td><td>xử lý ngắt</td></tr><tr><td>ms</td><td>1.000.000 ns</td><td>ổ đĩa, mạng</td></tr><tr><td>MB/s</td><td>0,001 GB/s</td><td>băng thông bus</td></tr><tr><td>GHz</td><td>1.000 MHz</td><td>xung nhịp CPU</td></tr></tbody></table>"
      },
      {
        title: "Checklist chọn cấu hình",
        body: "<ul><li>Xác định phần mềm có chạy song song nhiều lõi hay không.</li><li>Đủ RAM theo nhu cầu, cắm hai thanh vào hai kênh.</li><li>Tính băng thông bus trước khi gắn card mạng tốc độ cao.</li><li>Chọn SSD khi cần độ trễ thấp, ổ cơ chỉ để lưu trữ.</li><li>Đo lại bằng công cụ thật thay vì tin thông số trên hộp.</li></ul>"
      }
    ]
  });
})();
