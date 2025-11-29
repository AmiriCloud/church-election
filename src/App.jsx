import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

// اتصال به دیتابیس
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// لیست کاندیداها
const candidates = [
  // گروه ۱
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
    name: "هنگامه حمزوی‌عابدی",
    img: "https://avatars.planningcenteronline.com/uploads/person/104805225-1646270967/avatar.1.png?g=350x350%23",
  },
  {
    id: 5,
    name: "هانیه امیری",
    img: "https://avatars.planningcenteronline.com/uploads/person/102586472-1641944464/avatar.1.jpeg?g=350x350%23",
  },

  // گروه ۲
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
    name: "مهدی آقاجان مولایی",
    img: "https://avatars.planningcenteronline.com/uploads/person/102674806-1642189773/avatar.3.jpg?g=350x350%23",
  },
  {
    id: 10,
    name: "منصوره الیاسی",
    img: "https://avatars.planningcenteronline.com/uploads/person/102586624-1641944473/avatar.4.jpg?g=350x350%23",
  },

  // گروه ۳
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

  // گروه ۴
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
    name: "تالی هوسپیان‌مهر",
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

  // گروه ۵
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

function App() {
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // انتخاب/حذف کاندیدا
  const toggleCandidate = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      if (selectedIds.length < 12) {
        setSelectedIds([...selectedIds, id]);
      } else {
        alert("⚠️ ظرفیت تکمیل است! فقط ۱۲ نفر می‌توانید انتخاب کنید.");
      }
    }
  };

  // 1. ثبت رای صحیح (سبز)
  const submitVote = async () => {
    // جلوگیری از ثبت رای خالی با دکمه سبز
    if (selectedIds.length === 0)
      return alert(
        "❌ هنوز کسی را انتخاب نکرده‌اید! برای رای سفید از دکمه قرمز استفاده کنید."
      );

    setIsSubmitting(true);
    const { error } = await supabase
      .from("votes")
      .insert([{ selected_candidates: selectedIds }]);
    handlePostSubmit(error, "رای شما با موفقیت ثبت شد ✅");
  };

  // 2. ثبت رای باطله/سفید (قرمز)
  const submitInvalidVote = async () => {
    // گرفتن تاییدیه برای جلوگیری از کلیک اشتباه
    if (
      !window.confirm(
        "⚠️ آیا مطمئن هستید که می‌خواهید رای باطله (سفید) ثبت کنید؟"
      )
    )
      return;

    setIsSubmitting(true);
    // ارسال آرایه خالی به معنی رای باطله
    const { error } = await supabase
      .from("votes")
      .insert([{ selected_candidates: [] }]);
    handlePostSubmit(error, "رای باطله (سفید) ثبت شد ⚪");
  };

  // تابع مشترک بعد از ثبت
  const handlePostSubmit = (error, successMessage) => {
    if (error) {
      alert("خطا در ثبت رای! لطفا اینترنت را چک کنید.");
      console.error(error);
    } else {
      alert(successMessage);
      setSelectedIds([]);
      window.scrollTo(0, 0);
    }
    setIsSubmitting(false);
  };

  // ورود ادمین
  const handleAdminLogin = () => {
    const password = prompt("لطفاً رمز ورود مدیر را وارد کنید:");
    if (password === "1234") {
      navigate("/admin");
    } else if (password !== null) {
      alert("رمز اشتباه است! ⛔");
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "15px 10px",
        direction: "rtl",
        paddingBottom: "80px",
      }}
    >
      {/* هدر ثابت */}
      <div
        style={{
          position: "sticky",
          top: 10,
          backgroundColor: "rgba(255,255,255,0.95)",
          padding: "10px 15px",
          borderRadius: "15px",
          border: "1px solid #eee",
          zIndex: 100,
          boxShadow: "0 4px 15px -3px rgba(0,0,0,0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "0.8rem", color: "#888" }}>
            تعداد رای شما:
          </span>
          <div style={{ display: "flex", alignItems: "baseline", gap: "5px" }}>
            <strong
              style={{
                fontSize: "1.4rem",
                color: selectedIds.length === 12 ? "#28a745" : "#333",
              }}
            >
              {selectedIds.length}
            </strong>
            <span style={{ fontSize: "0.9rem", color: "#999" }}>/ 12</span>
          </div>
        </div>

        {/* دکمه‌های عملیاتی */}
        <div style={{ display: "flex", gap: "10px" }}>
          {/* دکمه قرمز (باطله) */}
          <button
            onClick={submitInvalidVote}
            disabled={isSubmitting}
            style={{
              padding: "8px 15px",
              fontSize: "0.8rem",
              backgroundColor: isSubmitting ? "#ccc" : "#ef4444", // قرمز
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            باطله ⚪
          </button>

          {/* دکمه سبز (ثبت اصلی) */}
          <button
            onClick={submitVote}
            // اگر کسی انتخاب نشده باشد یا در حال ارسال باشد، غیرفعال است
            disabled={isSubmitting || selectedIds.length === 0}
            style={{
              padding: "8px 20px",
              fontSize: "0.9rem",
              backgroundColor:
                isSubmitting || selectedIds.length === 0 ? "#ccc" : "#28a745", // سبز یا طوسی
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor:
                isSubmitting || selectedIds.length === 0
                  ? "not-allowed"
                  : "pointer",
              boxShadow:
                isSubmitting || selectedIds.length === 0
                  ? "none"
                  : "0 2px 5px rgba(40, 167, 69, 0.3)",
            }}
          >
            {isSubmitting ? "..." : "ثبت رای ✅"}
          </button>
        </div>
      </div>

      {/* لیست کاندیداها */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
        }}
      >
        {candidates.map((person) => {
          const isSelected = selectedIds.includes(person.id);
          return (
            <div
              key={person.id}
              onClick={() => toggleCandidate(person.id)}
              style={{
                position: "relative",
                border: isSelected ? "3px solid #28a745" : "1px solid #eee",
                borderRadius: "12px",
                overflow: "hidden",
                cursor: "pointer",
                backgroundColor: isSelected ? "#e6fffa" : "#fff",
                transition: "all 0.15s ease",
                transform: isSelected ? "scale(0.95)" : "scale(1)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "1/1",
                  overflow: "hidden",
                }}
              >
                <img
                  src={person.img}
                  alt={person.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: isSelected ? 0.8 : 1,
                  }}
                />
              </div>
              <div style={{ padding: "8px 4px", textAlign: "center" }}>
                <h4
                  style={{
                    margin: "0 0 4px 0",
                    fontSize: "0.75rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color: isSelected ? "#155724" : "#333",
                  }}
                >
                  {person.name}
                </h4>
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "#999",
                    backgroundColor: "#f5f5f5",
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}
                >
                  کد {person.id}
                </span>
              </div>
              {isSelected && (
                <div
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    backgroundColor: "#28a745",
                    color: "white",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }}
                >
                  ✓
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: "50px",
          textAlign: "center",
          borderTop: "1px solid #eee",
          paddingTop: "20px",
        }}
      >
        <button
          onClick={handleAdminLogin}
          style={{
            background: "transparent",
            border: "1px solid #ccc",
            color: "#999",
            padding: "5px 15px",
            borderRadius: "5px",
            fontSize: "0.8rem",
            cursor: "pointer",
          }}
        >
          🔐 ورود به پنل شمارش
        </button>
      </div>
    </div>
  );
}

export default App;
