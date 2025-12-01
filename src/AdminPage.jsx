// election-app/src/AdminPage.jsx
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  LabelList,
} from "recharts";
import { useNavigate } from "react-router-dom";

// اتصال به دیتابیس
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// تابع تبدیل اعداد به فارسی
const toPersianDigits = (n) => {
  if (n === undefined || n === null) return "";
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return n.toString().replace(/\d/g, (x) => farsiDigits[x]);
};

// لیست کاندیداها
const candidatesList = [
  { id: 1, name: "یلدا محمدی" },
  { id: 2, name: "یاسمن ده‌بزرگی" },
  { id: 3, name: "کیارش کیانی" },
  { id: 4, name: "هنگامه حمزوی" },
  { id: 5, name: "هانیه امیری" },
  { id: 6, name: "نگار کیانی" },
  { id: 7, name: "میترا وثوقیان" },
  { id: 8, name: "مهسا امیری" },
  { id: 9, name: "مهدی آقاجان" },
  { id: 10, name: "منصوره الیاسی" },
  { id: 11, name: "مجید طالعی" },
  { id: 12, name: "لیلا بهرامی" },
  { id: 13, name: "فریبا ذوقی" },
  { id: 14, name: "عبدالرضا هشترودی" },
  { id: 15, name: "شیما پیشه‌ورز" },
  { id: 16, name: "سارا رحیمی" },
  { id: 17, name: "حدیث باستانی" },
  { id: 18, name: "تالی هوسپیان" },
  { id: 19, name: "باقر احمدی" },
  { id: 20, name: "امیر امیری" },
  { id: 21, name: "الناز گودرزی" },
  { id: 22, name: "احد زمستانی" },
  { id: 23, name: "آنیتا ولتر" },
  { id: 24, name: "آزیتا فرسایی" },
  { id: 25, name: "آرتمیس محب" },
];

export default function AdminPage() {
  const [groups, setGroups] = useState({
    safe: [],
    conflict: [],
    reserves: [],
  });
  const [stats, setStats] = useState({ total: 0, valid: 0, invalid: 0 });
  const [chartData, setChartData] = useState([]);

  // استیت تنظیمات جلسه
  const [meetingSettings, setMeetingSettings] = useState({
    total_members: 200,
    present_members: 0,
    is_voting_active: false,
  });

  const navigate = useNavigate();

  const fetchResults = async () => {
    const { data: settingsData } = await supabase
      .from("settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (settingsData) {
      setMeetingSettings((prev) => ({
        ...prev,
        is_voting_active: settingsData.is_voting_active,
      }));
    }

    const { data: allVotes, error: voteError } = await supabase
      .from("votes")
      .select("selected_candidates");
    if (!voteError && allVotes) {
      const total = allVotes.length;
      const invalid = allVotes.filter(
        (v) => v.selected_candidates.length === 0
      ).length;
      setStats({ total, valid: total - invalid, invalid });
    }

    const { data: voteCounts } = await supabase.rpc("get_vote_counts");

    if (voteCounts) {
      const votesMap = {};
      voteCounts.forEach(
        (item) => (votesMap[item.candidate_id] = item.vote_count)
      );

      let allCandidates = candidatesList.map((person) => ({
        ...person,
        votes: votesMap[person.id] || 0,
      }));

      allCandidates.sort((a, b) => b.votes - a.votes || a.id - b.id);

      let currentRank = 1;
      allCandidates = allCandidates.map((item, index) => {
        if (index > 0 && item.votes < allCandidates[index - 1].votes)
          currentRank++;
        return { ...item, rank: currentRank };
      });

      setChartData(allCandidates);

      const CAPACITY = 12;
      if (allCandidates.length <= 12) {
        setGroups({ safe: allCandidates, conflict: [], reserves: [] });
        return;
      }

      const boundaryVote = allCandidates[CAPACITY - 1].votes;
      const nextPersonVote = allCandidates[CAPACITY].votes;

      if (boundaryVote > nextPersonVote) {
        setGroups({
          safe: allCandidates.slice(0, CAPACITY),
          conflict: [],
          reserves: allCandidates.slice(CAPACITY, CAPACITY + 2),
        });
      } else {
        const safeList = allCandidates.filter((c) => c.votes > boundaryVote);
        const conflictList = allCandidates.filter(
          (c) => c.votes === boundaryVote
        );
        const reservesList = allCandidates
          .filter((c) => c.votes < boundaryVote)
          .slice(0, 2);

        setGroups({
          safe: safeList,
          conflict: conflictList,
          reserves: reservesList,
        });
      }
    }
  };

  useEffect(() => {
    const loadInitialSettings = async () => {
      const { data } = await supabase
        .from("settings")
        .select("*")
        .eq("id", 1)
        .single();
      if (data)
        setMeetingSettings({
          total_members: data.total_members,
          present_members: data.present_members,
          is_voting_active: data.is_voting_active,
        });
    };
    loadInitialSettings();
  }, []);

  useEffect(() => {
    fetchResults();
    const interval = setInterval(fetchResults, 3000);
    return () => clearInterval(interval);
  }, []);

  const saveSettingsToDB = async () => {
    const { error } = await supabase
      .from("settings")
      .update({
        total_members: parseInt(meetingSettings.total_members),
        present_members: parseInt(meetingSettings.present_members),
      })
      .eq("id", 1);

    if (!error) {
      alert("✅ تنظیمات جلسه در دیتابیس ذخیره شد.");
    } else {
      alert("❌ خطا در ذخیره تنظیمات.");
    }
  };

  const handleSettingChange = (e) => {
    const { name, value } = e.target;
    setMeetingSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --- توابع کنترل رای‌گیری ---
  const handleStartVoting = async () => {
    const { error } = await supabase
      .from("settings")
      .update({ is_voting_active: true })
      .eq("id", 1);
    if (!error) {
      setMeetingSettings((prev) => ({ ...prev, is_voting_active: true }));
      alert("🟢 شمارش آرا آغاز شد. کاربران می‌توانند رای دهند.");
    }
  };

  const handleStopVoting = async () => {
    const { error } = await supabase
      .from("settings")
      .update({ is_voting_active: false })
      .eq("id", 1);
    if (!error) {
      setMeetingSettings((prev) => ({ ...prev, is_voting_active: false }));
      alert("🔴 شمارش آرا متوقف شد. پنل رای‌گیری قفل شد.");
    }
  };

  const handleResetElection = async () => {
    if (
      !window.confirm(
        "⛔ هشدار بسیار مهم!\n\nآیا مطمئن هستید که می‌خواهید تمام آرای داخل صندوق را پاک کنید؟\nاین عمل غیرقابل بازگشت است."
      )
    )
      return;

    const userInput = window.prompt(
      "برای حذف نهایی و صفر کردن صندوق، لطفاً کلمه «حذف» را تایپ کنید:"
    );

    if (userInput === "حذف") {
      await supabase.from("votes").delete().neq("id", 0);
      await supabase
        .from("settings")
        .update({ is_voting_active: false })
        .eq("id", 1);
      setMeetingSettings((prev) => ({ ...prev, is_voting_active: false }));

      alert("✅ صندوق تخلیه شد و رای‌گیری به حالت «متوقف» درآمد.");
      fetchResults();
    } else {
      alert("عملیات لغو شد.");
    }
  };

  const remainingSeats = 12 - groups.safe.length;
  const quorum = Math.floor(meetingSettings.total_members / 2) + 1;
  const isQuorumMet = meetingSettings.present_members >= quorum;

  const copyLiveLink = () => {
    const url = window.location.origin + "/live";
    navigator.clipboard.writeText(url);
    alert("لینک صفحه نمایش کپی شد! 📋\n\n" + url);
  };

  const handlePrint = () => {
    window.print();
  };

  const NameTick = (props) => {
    const { x, y, payload } = props;
    return (
      <text
        x={x + 10}
        y={y}
        dy={4}
        textAnchor="end"
        fill="#334155"
        style={{ fontSize: 12, direction: "rtl", fontFamily: "Vazirmatn" }}
      >
        {payload.value}
      </text>
    );
  };

  const VoteLabel = (props) => {
    const { x, y, width, height, value } = props;
    const barStartX = width < 0 ? x + width : x;
    const labelX = barStartX - 8;
    return (
      <text
        x={labelX}
        y={y + height / 2}
        textAnchor="end"
        fill="#64748b"
        fontSize={12}
        fontWeight="bold"
        dominantBaseline="middle"
        style={{ fontFamily: "Vazirmatn" }}
      >
        {toPersianDigits(value)}
      </text>
    );
  };

  return (
    <div
      className="main-container"
      style={{
        padding: "20px",
        direction: "rtl",
        fontFamily: "Vazirmatn",
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        paddingBottom: "100px",
      }}
    >
      {/* هدر */}
      <div
        className="no-print"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          background: "#fff",
          padding: "15px",
          borderRadius: "15px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              position: "relative",
              display: "flex",
              height: "12px",
              width: "12px",
            }}
          >
            <span
              style={{
                position: "absolute",
                display: "inline-flex",
                height: "100%",
                width: "100%",
                borderRadius: "50%",
                backgroundColor: isQuorumMet ? "#22c55e" : "#eab308",
                opacity: 0.75,
                animation: "ping 1s infinite",
              }}
            ></span>
            <span
              style={{
                position: "relative",
                display: "inline-flex",
                borderRadius: "50%",
                height: "12px",
                width: "12px",
                backgroundColor: isQuorumMet ? "#22c55e" : "#eab308",
              }}
            ></span>
          </span>
          <h2 style={{ margin: 0, fontSize: "1.2rem" }}>پنل نظارت بر آرا</h2>

          {/* نشانگر وضعیت رای‌گیری */}
          <div
            style={{
              fontSize: "0.8rem",
              padding: "4px 8px",
              borderRadius: "5px",
              background: meetingSettings.is_voting_active
                ? "#dcfce7"
                : "#fee2e2",
              color: meetingSettings.is_voting_active ? "#166534" : "#b91c1c",
              border: `1px solid ${
                meetingSettings.is_voting_active ? "#166534" : "#b91c1c"
              }`,
            }}
          >
            {meetingSettings.is_voting_active
              ? "🟢 در حال اخذ رای"
              : "🔴 متوقف شده"}
          </div>
        </div>

        <button
          onClick={() => navigate("/")}
          style={{
            background: "#f1f5f9",
            color: "#64748b",
            border: "none",
            borderRadius: "8px",
            padding: "8px 15px",
            cursor: "pointer",
          }}
        >
          خروج
        </button>
      </div>

      {/* تنظیمات */}
      <div
        className="no-print"
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "25px",
          background: "#f1f5f9",
          padding: "8px 15px",
          marginBottom: "20px",
          borderRadius: "10px",
          border: isQuorumMet ? "1px solid #cbd5e1" : "1px solid #fca5a5",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label
            style={{
              fontSize: "0.75rem",
              color: "#64748b",
              marginBottom: "2px",
            }}
          >
            کل اعضا
          </label>
          <input
            type="number"
            name="total_members"
            value={meetingSettings.total_members}
            onChange={handleSettingChange}
            style={{
              width: "60px",
              padding: "5px",
              borderRadius: "5px",
              border: "1px solid #cbd5e1",
              textAlign: "center",
              fontFamily: "Vazirmatn",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label
            style={{
              fontSize: "0.75rem",
              color: "#64748b",
              marginBottom: "2px",
            }}
          >
            حاضرین
          </label>
          <input
            type="number"
            name="present_members"
            value={meetingSettings.present_members}
            onChange={handleSettingChange}
            style={{
              width: "60px",
              padding: "5px",
              borderRadius: "5px",
              border: "1px solid #cbd5e1",
              textAlign: "center",
              fontFamily: "Vazirmatn",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minWidth: "80px",
          }}
        >
          <span
            style={{
              fontSize: "0.75rem",
              color: "#64748b",
              marginBottom: "2px",
            }}
          >
            حد نصاب
          </span>
          <div
            style={{
              padding: "5px",
              fontWeight: "bold",
              color: isQuorumMet ? "#16a34a" : "#ea580c",
            }}
          >
            {toPersianDigits(quorum)} ({isQuorumMet ? "✅" : "❌"})
          </div>
        </div>

        <button
          onClick={saveSettingsToDB}
          style={{
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "5px",
            padding: "8px 12px",
            cursor: "pointer",
            fontSize: "0.8rem",
            height: "35px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 48 48"
          >
            <path
              fill="#fff"
              stroke="#fff"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
              d="M4.189 22.173A2 2 0 0 1 6.181 20H10a2 2 0 0 1 2 2v19a2 2 0 0 1-2 2H7.834a2 2 0 0 1-1.993-1.827zM18 21.375c0-.836.52-1.584 1.275-1.94c1.649-.778 4.458-2.341 5.725-4.454c1.633-2.724 1.941-7.645 1.991-8.772c.007-.158.003-.316.024-.472c.271-1.953 4.04.328 5.485 2.74c.785 1.308.885 3.027.803 4.37c-.089 1.436-.51 2.823-.923 4.201l-.88 2.937h10.857a2 2 0 0 1 1.925 2.543l-5.37 19.016A2 2 0 0 1 36.986 43H20a2 2 0 0 1-2-2z"
            />
          </svg>
          ذخیره
        </button>
      </div>

      {/* بخش اطلاعات جلسه (فقط پرینت) */}
      <div className="only-print print-meeting-info">
        <div>
          👥 کل اعضا: {toPersianDigits(meetingSettings.total_members)} نفر
        </div>
        <div>
          👤 حاضرین در جلسه: {toPersianDigits(meetingSettings.present_members)}{" "}
          نفر
        </div>
        <div>⚖️ حد نصاب رسمی: {toPersianDigits(quorum)} نفر</div>
      </div>

      {/* آمار کلی */}
      <div
        className="print-stats"
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr",
          gap: "15px",
          marginBottom: "25px",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            color: "white",
            padding: "5px 10px",
            borderRadius: "15px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: "0.85rem", opacity: 0.9 }}>
            🗳️ کل برگه‌ها
          </span>
          <strong style={{ fontSize: "2rem" }}>
            {toPersianDigits(stats.total)}
          </strong>
        </div>
        <div
          style={{
            background: "#fff",
            padding: "5px 10px",
            borderRadius: "15px",
            textAlign: "center",
            border: "1px solid #e2e8f0",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <span
            style={{ color: "#16a34a", fontSize: "0.9rem", fontWeight: "bold" }}
          >
            ✅ صحیح
          </span>
          <div
            style={{ fontSize: "1.5rem", color: "#16a34a", fontWeight: "bold" }}
          >
            {toPersianDigits(stats.valid)}
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            padding: "5px 10px",
            borderRadius: "15px",
            textAlign: "center",
            border: "1px solid #e2e8f0",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <span
            style={{ color: "#ef4444", fontSize: "0.9rem", fontWeight: "bold" }}
          >
            ⚪ باطله
          </span>
          <div
            style={{ fontSize: "1.5rem", color: "#ef4444", fontWeight: "bold" }}
          >
            {toPersianDigits(stats.invalid)}
          </div>
        </div>
      </div>

      <div className="print-columns-container">
        {/* نمودار */}
        <div
          className="no-print"
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "30px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
          }}
        >
          <h3
            style={{ margin: "0 0 15px 0", fontSize: "1rem", color: "#94a3b8" }}
          >
            📊 نمودار پیشتازها
          </h3>
          <div style={{ height: "800px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 5, right: 80, left: 30, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#e2e8f0"
                />
                <XAxis type="number" hide reversed={true} />
                <YAxis
                  dataKey="name"
                  type="category"
                  orientation="right"
                  width={35}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  tick={<NameTick />}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  wrapperStyle={{ direction: "rtl", fontFamily: "Vazirmatn" }}
                  formatter={(value) => [toPersianDigits(value), "رای"]}
                />
                <Bar
                  dataKey="votes"
                  barSize={18}
                  radius={[0, 5, 5, 0]}
                  background={{ fill: "#f8fafc" }}
                >
                  <LabelList dataKey="votes" content={<VoteLabel />} />
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        groups.safe.some((s) => s.id === entry.id)
                          ? "#22c55e"
                          : groups.conflict.some((c) => c.id === entry.id)
                          ? "#f59e0b"
                          : "#cbd5e1"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* لیست منتخبین */}
        {groups.safe.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <h3
              style={{
                color: "#166534",
                margin: "0 0 10px 0",
                fontSize: "1.1rem",
              }}
            >
              ✅ منتخبین قطعی رهبری ({toPersianDigits(groups.safe.length)} نفر)
            </h3>
            <div
              style={{
                background: "#fff",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid #dcfce7",
              }}
            >
              {groups.safe.map((p) => (
                <CandidateRow
                  key={p.id}
                  person={p}
                  color="#22c55e"
                  bg="#22c55e"
                />
              ))}
            </div>
          </div>
        )}

        {/* گره انتخاباتی */}
        {groups.conflict.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                background: "#fff7ed",
                border: "1px solid #fdba74",
                padding: "15px",
                borderRadius: "12px",
                marginBottom: "10px",
              }}
            >
              <h3 style={{ color: "#c2410c", margin: 0, fontSize: "1.1rem" }}>
                ⚠️ گره انتخاباتی (نیاز به تعیین تکلیف)
              </h3>
              <p
                style={{
                  margin: "5px 0 0 0",
                  color: "#9a3412",
                  fontSize: "0.9rem",
                }}
              >
                رقابت بین{" "}
                <strong>{toPersianDigits(groups.conflict.length)} نفر</strong>{" "}
                برای کسب{" "}
                <strong>{toPersianDigits(remainingSeats)} صندلی</strong>{" "}
                باقی‌مانده.
              </p>
            </div>
            <div
              style={{
                background: "#fff",
                borderRadius: "12px",
                overflow: "hidden",
                border: "2px solid #fdba74",
              }}
            >
              {groups.conflict.map((p) => (
                <CandidateRow
                  key={p.id}
                  person={p}
                  color="#ea580c"
                  bg="#f97316"
                  showTie={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* علی‌البدل */}
        {groups.reserves.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <h3
              style={{
                color: "#64748b",
                margin: "0 0 10px 0",
                fontSize: "1rem",
              }}
            >
              🟡 رزرو / علی‌البدل احتمالی
            </h3>
            <div
              style={{
                background: "#fff",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid #e2e8f0",
                opacity: 0.8,
              }}
            >
              {groups.reserves.map((p) => (
                <CandidateRow
                  key={p.id}
                  person={p}
                  color="#64748b"
                  bg="#94a3b8"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* دکمه‌های پرینت و لینک */}
      <div
        className="no-print"
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "50px",
          marginBottom: "30px",
        }}
      >
        <button
          onClick={copyLiveLink}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "8px 15px",
            cursor: "pointer",
            width: "50%",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            style={{ width: "18px", height: "18px" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
            />
          </svg>
          لینک نمایش زنده
        </button>
        <button
          onClick={handlePrint}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            background: "#64748b",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "8px 15px",
            cursor: "pointer",
            width: "50%",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            style={{ width: "18px", height: "18px" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"
            />
          </svg>
          پرینت نتایج
        </button>
      </div>

      {/* دکمه‌های کنترل اصلی (شروع/توقف/ریست) */}
      <div
        className="no-print"
        style={{
          padding: "20px",
          borderTop: "2px dashed #cbd5e1",
          textAlign: "center",
        }}
      >
        {/* بخش کنترل رای‌گیری */}
        <div
          style={{
            display: "flex",
            gap: "15px",
            justifyContent: "center",
            marginBottom: "25px",
          }}
        >
          <button
            onClick={handleStartVoting}
            disabled={meetingSettings.is_voting_active}
            style={{
              backgroundColor: meetingSettings.is_voting_active
                ? "#dcfce7"
                : "#22c55e",
              color: meetingSettings.is_voting_active ? "#86efac" : "white",
              border: "none",
              padding: "10px 25px",
              borderRadius: "8px",
              cursor: meetingSettings.is_voting_active
                ? "not-allowed"
                : "pointer",
              fontWeight: "bold",
              fontSize: "1rem",
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.2em"
              height="2em"
              viewBox="0 0 24 24"
            >
              <path
                fill="#fff"
                d="M9.825 20.7q-2.575-.725-4.2-2.837T4 13q0-1.425.475-2.713t1.35-2.362q.275-.3.675-.313t.725.313q.275.275.288.675t-.263.75q-.6.775-.925 1.7T6 13q0 2.025 1.188 3.613t3.062 2.162q.325.1.538.375t.212.6q0 .5-.35.788t-.825.162m4.35 0q-.475.125-.825-.175t-.35-.8q0-.3.213-.575t.537-.375q1.875-.6 3.063-2.175T18 13q0-2.5-1.75-4.25T12 7h-.075l.4.4q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-2.1-2.1q-.15-.15-.212-.325T8.55 6t.063-.375t.212-.325l2.1-2.1q.275-.275.7-.275t.7.275t.275.7t-.275.7l-.4.4H12q3.35 0 5.675 2.325T20 13q0 2.725-1.625 4.85t-4.2 2.85"
              />
            </svg>
            آغاز شمارش
          </button>
          <button
            onClick={handleStopVoting}
            disabled={!meetingSettings.is_voting_active}
            style={{
              backgroundColor: !meetingSettings.is_voting_active
                ? "#fee2e2"
                : "#ef4444",
              color: !meetingSettings.is_voting_active ? "#fca5a5" : "white",
              border: "none",
              padding: "10px 25px",
              borderRadius: "8px",
              cursor: !meetingSettings.is_voting_active
                ? "not-allowed"
                : "pointer",
              fontWeight: "bold",
              fontSize: "1rem",
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 20 20"
            >
              <path
                fill="#fff"
                d="M17 16a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4.01V4a1 1 0 0 1 1-1a1 1 0 0 1 1 1v6h1V2a1 1 0 0 1 1-1a1 1 0 0 1 1 1v8h1V1a1 1 0 1 1 2 0v9h1V2a1 1 0 0 1 1-1a1 1 0 0 1 1 1v13h1V9a1 1 0 0 1 1-1h1z"
              />
            </svg>
            توقف شمارش
          </button>
        </div>

        {/* دکمه ریست */}
        <p
          style={{
            color: "#64748b",
            fontSize: "0.9rem",
            marginBottom: "10px",
          }}
        >
          منطقه خطر:
        </p>
        <button
          onClick={handleResetElection}
          style={{
            backgroundColor: "#fca5a5",
            color: "#7f1d1d",
            border: "1px solid #f87171",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            margin: "0 auto",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            style={{ width: "18px", height: "18px" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>{" "}
          تخلیه کامل صندوق و ریست انتخابات
        </button>
      </div>

      <style>{`@keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }`}</style>
    </div>
  );
}

function CandidateRow({ person, color, bg, showTie }) {
  // ... (همان کد قبلی) ...
  const toPersianDigits = (n) => {
    if (n === undefined || n === null) return "";
    const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return n.toString().replace(/\d/g, (x) => farsiDigits[x]);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "12px 15px",
        borderBottom: "1px solid #f1f5f9",
      }}
    >
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <span
          style={{
            background: bg,
            color: "#fff",
            width: "28px",
            height: "28px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
            fontWeight: "bold",
            fontFamily: "Vazirmatn",
          }}
        >
          {toPersianDigits(person.rank)}
        </span>
        <span style={{ fontWeight: "bold", color: "#1e293b" }}>
          {person.name}
        </span>
        {showTie && (
          <span
            style={{
              fontSize: "0.7rem",
              color: "#c2410c",
              background: "#ffedd5",
              padding: "2px 6px",
              borderRadius: "4px",
            }}
          >
            مساوی
          </span>
        )}
      </div>
      <div style={{ fontWeight: "bold", color: color }}>
        {toPersianDigits(person.votes)} رای
      </div>
    </div>
  );
}
