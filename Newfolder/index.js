function setupMenuToggle() {
  const menuToggle = document.getElementById("menu-toggle");
  const closeToggle = document.getElementById("close-toggle");
  const navbarLinks = document.getElementById("navbar-links");

  function openMenu() {
    if (!navbarLinks || !menuToggle || !closeToggle) return;
    navbarLinks.classList.add("active");
    menuToggle.style.display = "none";
    closeToggle.classList.add("active");
  }

  function closeMenu() {
    if (!navbarLinks || !menuToggle || !closeToggle) return;
    navbarLinks.classList.remove("active");
    menuToggle.style.display = "flex";
    closeToggle.classList.remove("active");
  }

  if (menuToggle && closeToggle && navbarLinks) {
    menuToggle.addEventListener("click", openMenu);
    closeToggle.addEventListener("click", closeMenu);
    Array.from(navbarLinks.getElementsByTagName("a")).forEach(link => {
      link.addEventListener("click", closeMenu);
    });
  }
}

// ================= Supabase Config =================
const SUPABASE_URL = "https://betluqegtnpriftqmasu.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJldGx1cWVndG5wcmlmdHFtYXN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NjM5NjksImV4cCI6MjA2OTQzOTk2OX0.vy5lRHLmqUq1lQV1U_gUuoY9QDjNupvsisC6Sb43Kr8";

const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ================= Load Hot IDs (Responsive + Dynamic) =================
async function loadHotIds() {
  const hotIdsGrid = document.getElementById("hot-ids-grid");
  if (!hotIdsGrid) return;

  hotIdsGrid.innerHTML = `<p style="color:yellow;">Loading IDs...</p>`;

  try {
    const { data, error } = await db
      .from("ff_ids") // ✅ Correct Table Name
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Responsive limit
    const screenWidth = window.innerWidth;
    let limit = 6;
    if (screenWidth < 768) limit = 2;
    else if (screenWidth < 1024) limit = 4;

    const idsToShow = data.slice(0, limit);
    hotIdsGrid.innerHTML = "";

    if (idsToShow.length === 0) {
      hotIdsGrid.innerHTML = `<p style="color:red;">No IDs found in database.</p>`;
      return;
    }

    idsToShow.forEach(item => {
      const card = document.createElement("div");
      card.className = "hot-id-card";
      card.innerHTML = `
        <h3>Level: ${item.level || "Unknown"}</h3>
        <p>${item.description || "No description available"}</p>
        <p style="color:#0f0; font-weight:bold;">Price: ${item.price || "N/A"} PKR</p>
        <a href="buy.html?id=${item.id}" class="view-btn">View Details</a>
      `;
      hotIdsGrid.appendChild(card);
    });

    console.log("✅ Loaded IDs from ff_ids:", idsToShow);
  } catch (err) {
    console.error("❌ Error loading IDs:", err);
    hotIdsGrid.innerHTML = `<p style="color:red;">Error loading IDs. Check console.</p>`;
  }
}

// ================= Testimonial Slider =================
function initTestimonials() {
  const testimonials = Array.from(document.querySelectorAll(".testimonial"));
  const groupSize = 3;
  let groupIndex = 0;

  function showTestimonialGroup(idx) {
    testimonials.forEach((el, i) => {
      if (i >= idx * groupSize && i < (idx + 1) * groupSize) {
        el.style.display = "block";
        el.style.opacity = "1";
        el.style.transition = "opacity 0.6s ease";
      } else {
        el.style.opacity = "0";
        setTimeout(() => (el.style.display = "none"), 500);
      }
    });
  }

  function showNextTestimonialGroup() {
    groupIndex = (groupIndex + 1) % Math.ceil(testimonials.length / groupSize);
    showTestimonialGroup(groupIndex);
  }

  if (testimonials.length > 0) {
    showTestimonialGroup(0);
    setInterval(showNextTestimonialGroup, 4000);
  }
}

// ================= DOM Ready =================
document.addEventListener("DOMContentLoaded", () => {
  // Initialize the mobile/mini navbar toggle after DOM is ready
  setupMenuToggle();
  loadHotIds();
  initTestimonials();
});

window.addEventListener("resize", loadHotIds);
