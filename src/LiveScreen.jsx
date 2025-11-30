import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// تابع تبدیل به فارسی
const toPersianDigits = (n) => {
  if (n === undefined || n === null) return "";
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return n.toString().replace(/\d/g, (x) => farsiDigits[x]);
};

// لیست کاندیداها
const candidatesList = [
  {
    id: 1,
    name: "یلدا محمدی",
    img: "https://avatars.planningcenteronline.com/uploads/person/103061257-1643067498/avatar.1.jpg?g=350x350%23",
  },
  {
    id: 2,
    name: "یاسمن ده‌بزرگی",
    img: "https://avatars.planningcenteronline.com/uploads/person/102586649-1641944475/avatar.1.jpeg?g=350x350%23",
  },
  {
    id: 3,
    name: "کیارش کیانی",
    img: "https://avatars.planningcenteronline.com/uploads/person/102677948-1642201294/avatar.3.png?g=350x350%23",
  },
  {
    id: 4,
    name: "هنگامه حمزوی",
    img: "https://avatars.planningcenteronline.com/uploads/person/104805225-1646270967/avatar.1.png?g=350x350%23",
  },
  {
    id: 5,
    name: "هانیه امیری",
    img: "https://avatars.planningcenteronline.com/uploads/person/102586472-1641944464/avatar.1.jpeg?g=350x350%23",
  },
  {
    id: 6,
    name: "نگار کیانی",
    img: "https://avatars.planningcenteronline.com/uploads/person/102684631-1642258975/avatar.1.jpg?g=350x350%23",
  },
  {
    id: 7,
    name: "میترا وثوقیان",
    img: "https://avatars.planningcenteronline.com/uploads/person/102586498-1641944466/avatar.2.jpeg?g=350x350%23",
  },
  {
    id: 8,
    name: "مهسا امیری",
    img: "https://avatars.planningcenteronline.com/uploads/person/102586477-1641922700/avatar.3.png?g=350x350%23",
  },
  {
    id: 9,
    name: "مهدی آقاجان",
    img: "https://avatars.planningcenteronline.com/uploads/person/102674806-1642189773/avatar.3.jpg?g=350x350%23",
  },
  {
    id: 10,
    name: "منصوره الیاسی",
    img: "https://avatars.planningcenteronline.com/uploads/person/102586624-1641944473/avatar.4.jpg?g=350x350%23",
  },
  {
    id: 11,
    name: "مجید طالعی",
    img: "https://avatars.planningcenteronline.com/uploads/person/127533535-1685880581/avatar.2.jpeg?g=350x350%23",
  },
  {
    id: 12,
    name: "لیلا بهرامی",
    img: "https://avatars.planningcenteronline.com/uploads/person/104805812-1646271985/avatar.2.jpeg?g=350x350%23",
  },
  {
    id: 13,
    name: "فریبا ذوقی",
    img: "https://avatars.planningcenteronline.com/uploads/person/102586489-1641944465/avatar.2.jpg?g=350x350%23",
  },
  {
    id: 14,
    name: "عبدالرضا هشترودی",
    img: "https://avatars.planningcenteronline.com/uploads/person/102586503-1641944466/avatar.2.png?g=350x350%23",
  },
  {
    id: 15,
    name: "شیما پیشه‌ورز",
    img: "https://avatars.planningcenteronline.com/uploads/person/102586551-1641944469/avatar.1.jpg?g=350x350%23",
  },
  {
    id: 16,
    name: "سارا رحیمی",
    img: "https://avatars.planningcenteronline.com/uploads/person/102586511-1641944466/avatar.2.jpeg?g=350x350%23",
  },
  {
    id: 17,
    name: "حدیث باستانی",
    img: "https://avatars.planningcenteronline.com/uploads/person/102586530-1641944467/avatar.5.jpg?g=350x350%23",
  },
  {
    id: 18,
    name: "تالی هوسپیان",
    img: "https://avatars.planningcenteronline.com/uploads/person/102586478-1641944464/avatar.1.jpg?g=350x350%23",
  },
  {
    id: 19,
    name: "باقر احمدی",
    img: "https://avatars.planningcenteronline.com/uploads/person/103081209-1643108412/avatar.2.png?g=350x350%23",
  },
  {
    id: 20,
    name: "امیر امیری",
    img: "https://avatars.planningcenteronline.com/uploads/person/102586479-1641944464/avatar.1.jpeg?g=350x350%23",
  },
  {
    id: 21,
    name: "الناز گودرزی",
    img: "https://avatars.planningcenteronline.com/uploads/person/127532557-1685875357/avatar.1.jpeg?g=350x350%23",
  },
  {
    id: 22,
    name: "احد زمستانی",
    img: "https://avatars.planningcenteronline.com/uploads/person/102586542-1641944468/avatar.2.jpeg?g=350x350%23",
  },
  {
    id: 23,
    name: "آنیتا ولتر",
    img: "https://avatars.planningcenteronline.com/uploads/person/102586548-1641944468/avatar.1.jpeg?g=350x350%23",
  },
  {
    id: 24,
    name: "آزیتا فرسایی",
    img: "https://avatars.planningcenteronline.com/uploads/person/103358655-1643653523/avatar.1.jpg?g=350x350%23",
  },
  {
    id: 25,
    name: "آرتمیس محب",
    img: "https://avatars.planningcenteronline.com/uploads/person/102586534-1641944467/avatar.2.png?g=350x350%23",
  },
];

export default function LiveScreen() {
  const [groups, setGroups] = useState({
    safe: [],
    conflict: [],
    reserves: [],
  });
  const [totalVotes, setTotalVotes] = useState(0);
  const [meetingSettings, setMeetingSettings] = useState({
    total_members: 200,
    present_members: 0,
  });

  const fetchResults = async () => {
    const { data: settings } = await supabase
      .from("settings")
      .select("*")
      .eq("id", 1)
      .single();
    if (settings) {
      setMeetingSettings({
        total_members: settings.total_members,
        present_members: settings.present_members,
      });
    }

    const { count } = await supabase
      .from("votes")
      .select("*", { count: "exact", head: true });
    setTotalVotes(count || 0);

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

      const CAPACITY = 12;
      if (allCandidates.length <= 12) {
        setGroups({ safe: allCandidates, conflict: [], reserves: [] });
      } else {
        const boundaryVote = allCandidates[CAPACITY - 1].votes;
        const nextPersonVote = allCandidates[CAPACITY].votes;

        if (boundaryVote > nextPersonVote) {
          setGroups({
            safe: allCandidates.slice(0, CAPACITY),
            conflict: [],
            reserves: allCandidates.slice(CAPACITY, CAPACITY + 2),
          });
        } else {
          setGroups({
            safe: allCandidates.filter((c) => c.votes > boundaryVote),
            conflict: allCandidates.filter((c) => c.votes === boundaryVote),
            reserves: allCandidates
              .filter((c) => c.votes < boundaryVote)
              .slice(0, 2),
          });
        }
      }
    }
  };

  useEffect(() => {
    fetchResults();
    const interval = setInterval(fetchResults, 3000);
    return () => clearInterval(interval);
  }, []);

  const remainingSeats = 12 - groups.safe.length;
  const quorum = Math.floor(meetingSettings.total_members / 2) + 1;
  const isQuorumMet = meetingSettings.present_members >= quorum;

  // حالت ۱: عدم حد نصاب
  if (!isQuorumMet) {
    return (
      <div
        style={{
          backgroundColor: "#0f172a",
          minHeight: "100vh",
          color: "white",
          fontFamily: "Vazirmatn",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          direction: "rtl",
        }}
      >
        <h1
          style={{
            fontSize: "3.5rem",
            marginBottom: "50px",
            color: "#e2e8f0",
            textShadow: "0 4px 10px rgba(0,0,0,0.5)",
          }}
        >
          وضعیت جلسه انتخابات
        </h1>

        <div style={{ display: "flex", gap: "40px", marginBottom: "60px" }}>
          <div
            style={{
              background: "#1e293b",
              padding: "30px",
              borderRadius: "20px",
              textAlign: "center",
              width: "280px",
              border: "1px solid #334155",
            }}
          >
            <span
              style={{
                display: "block",
                color: "#94a3b8",
                marginBottom: "15px",
                fontSize: "1.2rem",
              }}
            >
              کل اعضا
            </span>
            <strong style={{ fontSize: "4rem", color: "#fff" }}>
              {toPersianDigits(meetingSettings.total_members)}
            </strong>
          </div>

          <div
            style={{
              background: "#1e293b",
              padding: "30px",
              borderRadius: "20px",
              textAlign: "center",
              width: "280px",
              border: "2px solid #3b82f6",
              boxShadow: "0 0 20px rgba(59, 130, 246, 0.2)",
            }}
          >
            <span
              style={{
                display: "block",
                color: "#60a5fa",
                marginBottom: "15px",
                fontSize: "1.2rem",
              }}
            >
              حد نصاب لازم
            </span>
            <strong style={{ fontSize: "4rem", color: "#3b82f6" }}>
              {toPersianDigits(quorum)}
            </strong>
          </div>

          <div
            style={{
              background: "#1e293b",
              padding: "30px",
              borderRadius: "20px",
              textAlign: "center",
              width: "280px",
              border: "2px solid #ef4444",
            }}
          >
            <span
              style={{
                display: "block",
                color: "#f87171",
                marginBottom: "15px",
                fontSize: "1.2rem",
              }}
            >
              حاضرین فعلی
            </span>
            <strong style={{ fontSize: "4rem", color: "#f87171" }}>
              {toPersianDigits(meetingSettings.present_members)}
            </strong>
          </div>
        </div>

        <div
          style={{
            maxWidth: "900px",
            textAlign: "center",
            background: "rgba(239, 68, 68, 0.1)",
            padding: "40px",
            borderRadius: "20px",
            border: "1px solid #7f1d1d",
          }}
        >
          <h3
            style={{
              color: "#fca5a5",
              fontSize: "2rem",
              marginTop: 0,
              marginBottom: "20px",
            }}
          >
            ⚠️ جلسه به حد نصاب قانونی نرسیده است
          </h3>
          <p
            style={{ fontSize: "1.4rem", lineHeight: "1.8", color: "#cbd5e1" }}
          >
            با توجه به اینکه تعداد حاضرین کمتر از نصف به علاوه یک اعضا (
            {toPersianDigits(quorum)} نفر) می‌باشد، امکان اعلام نتایج قطعی در
            این جلسه وجود ندارد.
            <br />
            <br />
            <span style={{ color: "#fff", fontWeight: "bold" }}>
              روند ادامه:
            </span>{" "}
            رای‌گیری به صورت ترکیبی (حضوری + مجازی) ادامه خواهد یافت تا حقوق
            تمامی اعضا حفظ گردد.
          </p>
        </div>
      </div>
    );
  }

  // حالت ۲: حد نصاب رسیده
  return (
    <div
      style={{
        backgroundColor: "#0f172a",
        minHeight: "100vh",
        color: "white",
        fontFamily: "Vazirmatn",
        padding: "40px",
        direction: "rtl",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
          borderBottom: "2px solid #334155",
          paddingBottom: "20px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "3rem",
              margin: 0,
              textShadow: "0 0 20px rgba(34, 197, 94, 0.5)",
            }}
          >
            نتایج لحظه‌ای انتخابات
          </h1>
          <span
            style={{
              color: "#4ade80",
              fontSize: "1rem",
              marginTop: "5px",
              display: "block",
            }}
          >
            ✅ جلسه با {toPersianDigits(meetingSettings.present_members)} نفر
            حاضر رسمیت یافت
          </span>
        </div>
        <div
          style={{
            background: "#1e293b",
            padding: "15px 30px",
            borderRadius: "15px",
            border: "1px solid #22c55e",
            boxShadow: "0 0 15px rgba(34, 197, 94, 0.2)",
          }}
        >
          <span style={{ fontSize: "1.2rem", color: "#4ade80" }}>
            آرای شمارش شده:{" "}
          </span>
          <strong style={{ fontSize: "2.5rem", color: "#4ade80" }}>
            {toPersianDigits(totalVotes)}
          </strong>
        </div>
      </div>

      <div style={{ display: "flex", gap: "40px" }}>
        <div style={{ flex: 2 }}>
          <h2
            style={{
              color: "#4ade80",
              fontSize: "2rem",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span>✅</span> منتخبین هئیت رهبری (
            {toPersianDigits(groups.safe.length)} نفر)
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {groups.safe.map((p) => (
              <LiveCard key={p.id} person={p} color="#22c55e" />
            ))}
          </div>
        </div>

        <div
          style={{
            flex: 1.2,
            display: "flex",
            flexDirection: "column",
            gap: "30px",
          }}
        >
          {groups.conflict.length > 0 && (
            <div
              style={{
                background: "rgba(234, 88, 12, 0.1)",
                border: "2px solid #ea580c",
                borderRadius: "20px",
                padding: "20px",
                animation: "pulse 2s infinite",
              }}
            >
              <h2
                style={{
                  color: "#fb923c",
                  margin: "0 0 10px 0",
                  fontSize: "1.5rem",
                }}
              >
                ⚠️ رقابت حساس!
              </h2>
              <p
                style={{
                  fontSize: "1.2rem",
                  color: "#fdba74",
                  margin: "0 0 20px 0",
                }}
              >
                {toPersianDigits(groups.conflict.length)} نفر برای{" "}
                {toPersianDigits(remainingSeats)} صندلی باقی‌مانده
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {groups.conflict.map((p) => (
                  <LiveRow key={p.id} person={p} color="#fb923c" />
                ))}
              </div>
            </div>
          )}

          {groups.reserves.length > 0 && (
            <div>
              <h3
                style={{
                  color: "#94a3b8",
                  fontSize: "1.5rem",
                  marginBottom: "15px",
                }}
              >
                لیست رزرو
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {groups.reserves.map((p) => (
                  <LiveRow key={p.id} person={p} color="#64748b" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(234, 88, 12, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(234, 88, 12, 0); } }`}</style>
    </div>
  );
}

function LiveCard({ person, color }) {
  return (
    <div
      style={{
        background: "#1e293b",
        borderRadius: "15px",
        overflow: "hidden",
        border: `2px solid ${color}`,
        display: "flex",
        alignItems: "center",
        padding: "10px",
      }}
    >
      <img
        src={person.img}
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid #334155",
        }}
      />
      <div style={{ paddingRight: "15px" }}>
        <h3 style={{ margin: "0 0 5px 0", fontSize: "1.3rem" }}>
          {person.name}
        </h3>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span
            style={{
              background: color,
              color: "#000",
              padding: "2px 8px",
              borderRadius: "5px",
              fontWeight: "bold",
            }}
          >
            رتبه {toPersianDigits(person.rank)}
          </span>
          <span style={{ color: "#cbd5e1", fontSize: "1.1rem" }}>
            {toPersianDigits(person.votes)} رای
          </span>
        </div>
      </div>
    </div>
  );
}

function LiveRow({ person, color }) {
  return (
    <div
      style={{
        background: "#1e293b",
        borderRadius: "10px",
        padding: "15px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderRight: `5px solid ${color}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span
          style={{
            background: "#334155",
            width: "30px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            fontWeight: "bold",
          }}
        >
          {toPersianDigits(person.rank)}
        </span>
        <span style={{ fontSize: "1.2rem" }}>{person.name}</span>
      </div>
      <strong style={{ fontSize: "1.2rem", color: color }}>
        {toPersianDigits(person.votes)}
      </strong>
    </div>
  );
}
