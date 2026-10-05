import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Download,
  Printer,
  Edit3,
  Save,
  CheckCircle2,
  Calendar,
  FileCheck,
} from 'lucide-react';

export const MinutesView: React.FC = () => {
  const { minutes, updateMinutes, classRankings, currentWeek, settings, currentUser, hasPermission } = useApp();

  const canSign = hasPermission('canSignMinutes');
  const canExport = hasPermission('canExportData');

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: minutes.title,
    advantages: minutes.advantages,
    shortcomings: minutes.shortcomings,
    evaluation: minutes.evaluation,
    recommendations: minutes.recommendations,
    signerLeader: minutes.signerLeader,
    signerPrincipal: minutes.signerPrincipal,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    if (!canSign) return;
    updateMinutes(formData);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Export as Word (.doc HTML MIME format that Word natively opens cleanly with formatting)
  const handleExportWord = () => {
    if (!canExport) return;
    const tableRows = classRankings
      .map(
        (c) =>
          `<tr>
            <td style="text-align:center;border:1px solid #333;padding:6px;">${c.rank}</td>
            <td style="border:1px solid #333;padding:6px;font-weight:bold;">${c.className}</td>
            <td style="border:1px solid #333;padding:6px;">${c.homeroomTeacher}</td>
            <td style="text-align:center;border:1px solid #333;padding:6px;">${c.baseScore}</td>
            <td style="text-align:center;border:1px solid #333;padding:6px;color:#c00;">-${c.totalDeductions}</td>
            <td style="text-align:center;border:1px solid #333;padding:6px;color:#090;">+${c.totalBonuses}</td>
            <td style="text-align:center;border:1px solid #333;padding:6px;font-weight:bold;">${c.finalScore}</td>
            <td style="text-align:center;border:1px solid #333;padding:6px;">${c.rating}</td>
          </tr>`
      )
      .join('');

    const wordContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Biên bản nhận xét trực tuần</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 14pt; line-height: 1.4; }
        table { border-collapse: collapse; width: 100%; margin: 12px 0; }
        th { border: 1px solid #333; background-color: #f0f0f0; padding: 6px; }
        .header-table { border: none; width: 100%; margin-bottom: 20px; }
        .header-table td { border: none; padding: 2px; }
      </style>
      </head>
      <body>
        <table class="header-table">
          <tr>
            <td style="text-align:center;width:45%;">
              PHÒNG GD&ĐT HUYỆN QUẢN BẠ<br/>
              <b>TRƯỜNG PTDTBT TH&THCS QUẢN BẠ</b><br/>
              <b>LIÊN ĐỘI THIẾU NIÊN TIỀN PHONG</b><br/>
              ***
            </td>
            <td style="text-align:center;width:55%;">
              <b>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</b><br/>
              <b>Độc lập – Tự do – Hạnh phúc</b><br/>
              <i>Quản Bạ, ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm 2026</i>
            </td>
          </tr>
        </table>

        <div style="text-align:center;margin: 20px 0;">
          <h2 style="margin:0;font-size:16pt;text-transform:uppercase;">${formData.title}</h2>
          <p style="margin:5px 0;font-style:italic;">Tuần ${currentWeek?.weekNumber || 4} (${minutes.periodText})</p>
        </div>

        <p><b>I. ĐÁNH GIÁ CÁC MẶT ƯU ĐIỂM:</b></p>
        <div style="margin-left:20px;white-space:pre-line;">${formData.advantages}</div>

        <p style="margin-top:15px;"><b>II. CÁC MẶT CÒN TỒN TẠI, HẠN CHẾ:</b></p>
        <div style="margin-left:20px;white-space:pre-line;">${formData.shortcomings}</div>

        <p style="margin-top:15px;"><b>III. KẾT QUẢ THI ĐUA NỀ NẾP CÁC CHI ĐỘI:</b></p>
        <table>
          <thead>
            <tr>
              <th>Hạng</th>
              <th>Chi đội</th>
              <th>Giáo viên CN</th>
              <th>Điểm nền</th>
              <th>Điểm trừ</th>
              <th>Điểm cộng</th>
              <th>Tổng điểm</th>
              <th>Xếp loại</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <p style="margin-top:15px;"><b>IV. ĐÁNH GIÁ, NHẬN XÉT CHUNG:</b></p>
        <div style="margin-left:20px;white-space:pre-line;">${formData.evaluation}</div>

        <p style="margin-top:15px;"><b>V. KIẾN NGHỊ VÀ PHƯƠNG HƯỚNG TUẦN TIẾP THEO:</b></p>
        <div style="margin-left:20px;white-space:pre-line;">${formData.recommendations}</div>

        <br/><br/>
        <table style="border:none;margin-top:30px;">
          <tr>
            <td style="border:none;text-align:center;width:50%;">
              <b>DUYỆT CỦA BAN GIÁM HIỆU</b><br/>
              <i>(Ký và ghi rõ họ tên)</i>
              <br/><br/><br/><br/>
              <b>${formData.signerPrincipal}</b>
            </td>
            <td style="border:none;text-align:center;width:50%;">
              <b>TỔNG PHỤ TRÁCH ĐỘI</b><br/>
              <i>(Ký và ghi rõ họ tên)</i>
              <br/><br/><br/><br/>
              <b>${formData.signerLeader}</b>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\uFEFF' + wordContent], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Bien_ban_truc_tuan_${currentWeek?.weekNumber || 4}_Quan_Ba.doc`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header bar - Royal Blue Banner */}
      <div className="bg-gradient-to-r from-[#0F275A] via-[#143B7E] to-[#1E4EB8] text-white p-5 rounded-2xl border border-blue-900/40 shadow-md flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-lg font-black text-white">Biên bản Nhận xét Trực tuần</h2>
          <p className="text-xs text-blue-200 mt-0.5">
            Soạn thảo, xem trước và xuất biên bản đánh giá thi đua nề nếp dùng trong buổi Lễ Chào cờ đầu tuần
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isEditing ? (
            <button
              onClick={handleSave}
              disabled={!canSign}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-white text-xs font-bold rounded-xl shadow-xs transition-colors ${
                canSign
                  ? 'bg-emerald-500 hover:bg-emerald-600 cursor-pointer'
                  : 'bg-slate-400 opacity-40 cursor-not-allowed pointer-events-auto'
              }`}
              title={canSign ? 'Lưu nội dung' : 'Tài khoản không có quyền ký/sửa biên bản'}
            >
              <Save className="w-3.5 h-3.5" />
              Lưu nội dung
            </button>
          ) : (
            <button
              onClick={() => canSign && setIsEditing(true)}
              disabled={!canSign}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border shadow-xs transition-colors ${
                canSign
                  ? 'bg-white/20 hover:bg-white/30 text-white border-white/30 cursor-pointer'
                  : 'bg-white/10 text-slate-400 border-white/10 opacity-40 cursor-not-allowed pointer-events-auto'
              }`}
              title={canSign ? 'Sửa nhận xét' : 'Tài khoản không được phân quyền sửa biên bản'}
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-300" />
              Sửa nhận xét
            </button>
          )}

          <button
            onClick={handleExportWord}
            disabled={!canExport}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl shadow-xs transition-colors ${
              canExport
                ? 'bg-blue-600/80 hover:bg-blue-600 text-white border border-blue-400/40 cursor-pointer'
                : 'bg-slate-100 text-slate-400 border border-slate-200 opacity-40 cursor-not-allowed pointer-events-auto'
            }`}
            title={canExport ? 'Xuất Word (.doc)' : 'Tài khoản không có quyền xuất dữ liệu'}
          >
            <Download className="w-3.5 h-3.5 text-blue-200" />
            Xuất Word (.doc)
          </button>

          <button
            onClick={handlePrint}
            disabled={!canExport}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl shadow-xs transition-colors ${
              canExport
                ? 'bg-amber-400 hover:bg-amber-300 text-blue-950 cursor-pointer'
                : 'bg-slate-200 text-slate-400 opacity-40 cursor-not-allowed pointer-events-auto'
            }`}
            title={canExport ? 'In / Xuất PDF' : 'Tài khoản không có quyền in / xuất dữ liệu'}
          >
            <Printer className="w-3.5 h-3.5" />
            In / Xuất PDF
          </button>
        </div>
      </div>

      {!canSign && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-2xl text-xs flex items-center gap-2.5 shadow-xs print:hidden">
          <FileCheck className="w-4 h-4 text-amber-600 shrink-0" />
          <div>
            <span className="font-bold">Chế độ xem Biên bản trực tuần (Chỉ đọc): </span>
            <span>
              Tài khoản <strong>{currentUser.name}</strong> ({currentUser.title || currentUser.role}) chỉ có quyền tra cứu biên bản trực tuần. Quyền chỉnh sửa nhận xét và ký duyệt văn bản yêu cầu được Quản trị viên cấp quyền trong Bảng phân quyền.
            </span>
          </div>
        </div>
      )}

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl p-3 text-xs flex items-center gap-2 print:hidden">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Nội dung biên bản trực tuần đã được lưu thành công!</span>
        </div>
      )}

      {/* Official Document Preview Container (Paper Style) */}
      <div className="bg-white rounded-2xl border-2 border-blue-200 shadow-md p-6 sm:p-10 max-w-4xl mx-auto font-serif print:shadow-none print:border-none print:p-0">
        {/* National Header */}
        <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm text-center pb-6 border-b border-slate-300">
          <div>
            <p className="font-semibold uppercase tracking-wide">PHÒNG GD&ĐT HUYỆN QUẢN BẠ</p>
            <p className="font-bold uppercase tracking-wide text-blue-950">
              TRƯỜNG PTDTBT TH&THCS QUẢN BẠ
            </p>
            <p className="font-semibold uppercase text-slate-700 text-xs mt-0.5">
              LIÊN ĐỘI THIẾU NIÊN TIỀN PHONG
            </p>
            <div className="w-16 h-0.5 bg-slate-400 mx-auto mt-1"></div>
          </div>

          <div>
            <p className="font-bold uppercase tracking-wide">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
            <p className="font-bold text-xs mt-0.5">Độc lập – Tự do – Hạnh phúc</p>
            <div className="w-24 h-0.5 bg-slate-400 mx-auto mt-1 mb-1"></div>
            <p className="text-xs italic text-slate-500">
              Quản Bạ, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm 2026
            </p>
          </div>
        </div>

        {/* Title */}
        <div className="text-center my-6">
          <h1 className="text-lg sm:text-xl font-bold uppercase text-slate-900 tracking-wide">
            {formData.title}
          </h1>
          <p className="text-xs italic text-slate-600 mt-1">
            Tuần {currentWeek?.weekNumber || 4} ({minutes.periodText})
          </p>
        </div>

        {/* Section 1: Ưu điểm */}
        <div className="space-y-2 mb-6">
          <h3 className="font-bold uppercase text-sm text-slate-900">I. ĐÁNH GIÁ CÁC MẶT ƯU ĐIỂM:</h3>
          {isEditing ? (
            <textarea
              rows={4}
              value={formData.advantages}
              onChange={(e) => setFormData({ ...formData, advantages: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-sans focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line pl-4 border-l-2 border-slate-200">
              {formData.advantages}
            </div>
          )}
        </div>

        {/* Section 2: Tồn tại */}
        <div className="space-y-2 mb-6">
          <h3 className="font-bold uppercase text-sm text-slate-900">
            II. CÁC MẶT CÒN TỒN TẠI, HẠN CHẾ:
          </h3>
          {isEditing ? (
            <textarea
              rows={4}
              value={formData.shortcomings}
              onChange={(e) => setFormData({ ...formData, shortcomings: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-sans focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line pl-4 border-l-2 border-slate-200">
              {formData.shortcomings}
            </div>
          )}
        </div>

        {/* Section 3: Kết quả thi đua (Tự động lấy từ DB) */}
        <div className="space-y-2 mb-6">
          <h3 className="font-bold uppercase text-sm text-slate-900">
            III. KẾT QUẢ THI ĐUA NỀ NẾP CÁC CHI ĐỘI:
          </h3>
          <p className="text-xs italic text-slate-500 mb-2 font-sans">
            (Bảng điểm tổng hợp tự động từ 240 lượt chấm nề nếp của Ban Cờ đỏ và duyệt của Tổng phụ trách)
          </p>

          <div className="overflow-x-auto border border-slate-300 rounded-lg">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-100 border-b border-slate-300 font-bold text-slate-800 uppercase text-[10px]">
                <tr>
                  <th className="py-2 px-2.5 text-center">Hạng</th>
                  <th className="py-2 px-3">Chi đội</th>
                  <th className="py-2 px-3">GVCN</th>
                  <th className="py-2 px-2.5 text-center">Điểm nền</th>
                  <th className="py-2 px-2.5 text-center">Điểm trừ</th>
                  <th className="py-2 px-2.5 text-center">Điểm cộng</th>
                  <th className="py-2 px-2.5 text-center font-bold">Tổng điểm</th>
                  <th className="py-2 px-3">Xếp loại</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {classRankings.slice(0, 10).map((c) => (
                  <tr key={c.classId}>
                    <td className="py-1.5 px-2.5 text-center font-bold">#{c.rank}</td>
                    <td className="py-1.5 px-3 font-bold text-slate-900">{c.className}</td>
                    <td className="py-1.5 px-3 text-slate-700">{c.homeroomTeacher}</td>
                    <td className="py-1.5 px-2.5 text-center font-mono">{c.baseScore}</td>
                    <td className="py-1.5 px-2.5 text-center font-mono text-rose-600 font-bold">
                      -{c.totalDeductions}
                    </td>
                    <td className="py-1.5 px-2.5 text-center font-mono text-emerald-600 font-bold">
                      +{c.totalBonuses}
                    </td>
                    <td className="py-1.5 px-2.5 text-center font-bold font-mono text-blue-900">
                      {c.finalScore}
                    </td>
                    <td className="py-1.5 px-3 font-semibold">{c.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Nhận xét */}
        <div className="space-y-2 mb-6">
          <h3 className="font-bold uppercase text-sm text-slate-900">IV. ĐÁNH GIÁ, NHẬN XÉT CHUNG:</h3>
          {isEditing ? (
            <textarea
              rows={3}
              value={formData.evaluation}
              onChange={(e) => setFormData({ ...formData, evaluation: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-sans focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line pl-4 border-l-2 border-slate-200">
              {formData.evaluation}
            </div>
          )}
        </div>

        {/* Section 5: Kiến nghị */}
        <div className="space-y-2 mb-8">
          <h3 className="font-bold uppercase text-sm text-slate-900">
            V. KIẾN NGHỊ VÀ PHƯƠNG HƯỚNG TUẦN TIẾP THEO:
          </h3>
          {isEditing ? (
            <textarea
              rows={3}
              value={formData.recommendations}
              onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-sans focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line pl-4 border-l-2 border-slate-200">
              {formData.recommendations}
            </div>
          )}
        </div>

        {/* Official Signatures Area */}
        <div className="grid grid-cols-2 gap-8 text-center pt-8 border-t border-slate-300 text-xs sm:text-sm">
          <div>
            <p className="font-bold uppercase">DUYỆT CỦA BAN GIÁM HIỆU</p>
            <p className="text-xs italic text-slate-500">(Ký và đóng dấu)</p>
            <div className="h-20"></div>
            <p className="font-bold text-slate-900">{formData.signerPrincipal}</p>
          </div>

          <div>
            <p className="font-bold uppercase">TỔNG PHỤ TRÁCH ĐỘI</p>
            <p className="text-xs italic text-slate-500">(Ký và ghi rõ họ tên)</p>
            <div className="h-20"></div>
            <p className="font-bold text-slate-900">{formData.signerLeader}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
