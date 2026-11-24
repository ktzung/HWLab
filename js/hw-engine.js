/* HWLab engine — thời gian, cache, công suất; kết quả tất định */
window.HW_ENGINE = (function () {
  const r2 = (n) => Math.round(n * 100) / 100;
  const r1 = (n) => Math.round(n * 10) / 10;
  const fmt = (n) => Number(n).toLocaleString("vi-VN", { maximumFractionDigits: 2 });

  function cpi(v) {
    const instr = Number(v.instructions);
    const cpiValue = Number(v.cpi);
    const clock = Math.max(0.1, Number(v.clockGHz));
    const timeSeconds = r2((instr * 1e6 * cpiValue) / (clock * 1e9));
    const timeMs = r1(timeSeconds * 1000);
    const ok = timeSeconds <= 1 ? 1 : 0;
    return {
      ok: !!ok,
      verdict: ok ? "Chạy dưới một giây" : "Chạy trên một giây",
      meta: `${fmt(timeSeconds)} giây cho ${fmt(instr)} triệu lệnh`,
      statusText: ok ? `${fmt(timeSeconds)} s · dưới hạn 1 giây` : `${fmt(timeSeconds)} s · vượt hạn 1 giây`,
      tags: ["Thời gian", `CPI ${cpiValue}`, `${clock} GHz`],
      trace: [
        { step: "cycles", label: "Tổng chu kỳ", result: "ok", note: `${fmt(instr)} triệu lệnh × CPI ${cpiValue} = ${fmt(instr * cpiValue)} triệu chu kỳ` },
        { step: "clock", label: "Xung nhịp", result: "ok", note: `${clock} GHz = ${fmt(clock * 1000)} triệu chu kỳ mỗi giây` },
        { step: "time", label: "Thời gian", result: "ok", note: `${fmt(instr * cpiValue)} ÷ ${fmt(clock * 1000)} = ${fmt(timeSeconds)} giây` },
        { step: "verdict", label: "Kết luận", result: ok ? "ok" : "fail", note: ok ? "Nằm dưới hạn 1 giây" : "Vượt hạn 1 giây, cần giảm CPI hoặc tăng xung" }
      ],
      payloadTitle: "Chi tiết phép tính",
      payload: {
        "số lệnh": `${fmt(instr)} triệu`,
        "CPI": `${cpiValue}`,
        "xung nhịp": `${clock} GHz`,
        "tổng chu kỳ": `${fmt(instr * cpiValue)} triệu`,
        "thời gian": `${fmt(timeSeconds)} giây`
      },
      metrics: [
        { label: "Thời gian", value: `${fmt(timeSeconds)} s` },
        { label: "Tổng chu kỳ", value: `${fmt(instr * cpiValue)} triệu` },
        { label: "Xung nhịp", value: `${clock} GHz` },
        { label: "Kết luận", value: ok ? "đạt" : "chậm" }
      ],
      values: { timeSeconds, timeMs, ok }
    };
  }

  function cache(v) {
    const hitPct = Number(v.hitPct);
    const hitTime = Number(v.hitTime);
    const missPenalty = Number(v.missPenalty);
    const missPct = 100 - hitPct;
    const avgCycles = r1(hitTime + (missPct / 100) * missPenalty);
    const ok = avgCycles <= 20 ? 1 : 0;
    return {
      ok: !!ok,
      verdict: ok ? "Cache đạt ngưỡng" : "Cache quá chậm",
      meta: `${avgCycles} chu kỳ trung bình mỗi truy cập`,
      statusText: ok ? `${avgCycles} chu kỳ · dưới ngưỡng 20` : `${avgCycles} chu kỳ · vượt ngưỡng 20`,
      tags: ["Cache", `trúng ${hitPct}%`, `phạt ${missPenalty}`],
      trace: [
        { step: "hit", label: "Đường trúng", result: "ok", note: `Trúng ${hitPct}% tốn ${hitTime} chu kỳ` },
        { step: "miss", label: "Đường trượt", result: "ok", note: `Trượt ${missPct}% tốn thêm ${missPenalty} chu kỳ` },
        { step: "avg", label: "Trung bình", result: ok ? "ok" : "warn", note: `${hitTime} + ${missPct}% × ${missPenalty} = ${avgCycles} chu kỳ` },
        { step: "verdict", label: "Kết luận", result: ok ? "ok" : "fail", note: ok ? "Dưới ngưỡng 20 chu kỳ" : "Vượt ngưỡng 20 chu kỳ, cần tăng tỉ lệ trúng hoặc giảm phạt" }
      ],
      payloadTitle: "Chi tiết phép tính",
      payload: {
        "tỉ lệ trúng": `${hitPct}%`,
        "tỉ lệ trượt": `${missPct}%`,
        "chu kỳ khi trúng": `${hitTime}`,
        "phạt khi trượt": `${missPenalty}`,
        "chu kỳ trung bình": `${avgCycles}`
      },
      metrics: [
        { label: "Chu kỳ TB", value: `${avgCycles}` },
        { label: "Tỉ lệ trượt", value: `${missPct}%` },
        { label: "Phạt trượt", value: `${missPenalty}` },
        { label: "Kết luận", value: ok ? "đạt" : "chậm" }
      ],
      values: { avgCycles, missPct, ok }
    };
  }

  function power(v) {
    const cores = Number(v.cores);
    const watts = Number(v.wattsPerCore);
    const idle = Number(v.idlePct);
    const limit = Number(v.limitW);
    const base = 20;
    const active = r1(cores * watts * ((100 - idle) / 100));
    const total = r1(base + active);
    const ok = total <= limit ? 1 : 0;
    return {
      ok: !!ok,
      verdict: ok ? "Trong hạn mức điện" : "Vượt hạn mức điện",
      meta: `${fmt(total)} W trên hạn ${fmt(limit)} W`,
      statusText: ok ? `${fmt(total)} W · dưới hạn ${fmt(limit)} W` : `${fmt(total)} W · vượt hạn ${fmt(limit)} W`,
      tags: ["Công suất", `${cores} lõi`, `nhàn rỗi ${idle}%`],
      trace: [
        { step: "active", label: "Công suất lõi", result: "ok", note: `${cores} × ${watts} W × ${100 - idle}% = ${fmt(active)} W` },
        { step: "base", label: "Công suất nền", result: "ok", note: `Bo mạch, quạt và nguồn tốn ${base} W` },
        { step: "total", label: "Tổng công suất", result: ok ? "ok" : "warn", note: `${fmt(active)} + ${base} = ${fmt(total)} W` },
        { step: "verdict", label: "Kết luận", result: ok ? "ok" : "fail", note: ok ? `Nằm dưới hạn ${fav(limit)} W` : `Vượt hạn ${fav(limit)} W, cần hạ xung hoặc tắt bớt lõi` }
      ],
      payloadTitle: "Chi tiết phép tính",
      payload: {
        "số lõi": `${cores}`,
        "W mỗi lõi": `${watts}`,
        "tỉ lệ chạy": `${100 - idle}%`,
        "công suất lõi": `${fmt(active)} W`,
        "công suất nền": `${base} W`,
        "tổng": `${fmt(total)} W`
      },
      metrics: [
        { label: "Tổng công suất", value: `${fmt(total)} W` },
        { label: "Công suất lõi", value: `${fmt(active)} W` },
        { label: "Hạn mức", value: `${fmt(limit)} W` },
        { label: "Kết luận", value: ok ? "đạt" : "vượt" }
      ],
      values: { watts: total, activeCores: cores, ok }
    };
  }

  function fav(n) {
    return Number(n).toLocaleString("vi-VN", { maximumFractionDigits: 1 });
  }

  const runners = { cpi, cache, power };

  function run(kind, values) {
    const fn = runners[kind];
    if (!fn) return { ok: false, verdict: "Không rõ", meta: "", statusText: "Không rõ", tags: [], trace: [], payload: {}, metrics: [], values: {} };
    return fn(values || {});
  }

  return {
    run,
    kinds: Object.keys(runners),
    labels: { cpi: "Thời gian", cache: "Cache", power: "Công suất" }
  };
})();
