document.addEventListener("DOMContentLoaded", async () => {
  landing = document.getElementById("landing");
  slide_screen = document.getElementById("slideshow");
  slide = document.getElementById("stats");
  progress_bar = document.getElementById("progress-bar");
  start_btn = document.getElementById("start-btn");
  response = await fetch("../data.json");
  data = await response.json();
  index = 0;
  slides = []; //Stores html content of each slide
  background_classes = []; // This stores the class for each slide
  themes = [
    // Imma use these themes for person slides too
    { bg: "busy-day", tb: "" },
    { bg: "ghost", tb: "ghost-table" },
    { bg: "hype", tb: "hype-table" },
    { bg: "owl", tb: "owl-table" },
    { bg: "convo", tb: "convo-table" },
  ];

  document.addEventListener("change", (e) => {
    if (e.target.classList.contains("person-select")) {
      const selects = document.querySelectorAll(".person-select");
      const selectedNames = Array.from(selects)
        .map((s) => s.value)
        .filter((val) => val !== "");

      const table = document.getElementById("compare-table");
      const headersRow = document.getElementById("compare-headers");
      const body = document.getElementById("compare-body");

      // Hide table if no one is selected
      if (selectedNames.length === 0) {
        table.style.display = "none";
        return;
      }

      table.style.display = "table";

      // 1. Build the Table Headers
      let headersHTML = `<th class="text-start">Stat</th>`;
      selectedNames.forEach((name) => {
        headersHTML += `<th class="text-end">${name}</th>`;
      });
      headersRow.innerHTML = headersHTML;

      // 2. Define the stats we want to compare based on your data.persons keys
      const statsToCompare = [
        { key: "total_messages", label: "Total Messages" },
        { key: "total_words", label: "Total Words" },
        { key: "avg_response_time", label: "Avg Response Time" },
        { key: "activity_concentration", label: "Activity Focus" },
      ];

      // 3. Build the Table Rows
      let bodyHTML = "";
      statsToCompare.forEach((stat) => {
        bodyHTML += `<tr><td class="text-start text-capitalize fw-bold">${stat.label}</td>`;

        selectedNames.forEach((name) => {
          const personData = data.persons[name] || {};
          let val =
            personData[stat.key] !== undefined ? personData[stat.key] : 0;

          // Add formatting like % or min
          if (stat.key === "avg_response_time") val += " min";
          if (stat.key === "activity_concentration") val += "%";

          bodyHTML += `<td class="text-end">${val}</td>`;
        });

        bodyHTML += `</tr>`;
      });

      body.innerHTML = bodyHTML;
    }
  });
  // ---------------------------------------------------------

  function build_group_slides() {
    // 1.Busy Day Slide
    let html = `
     <p class="title-text">BUSIEST DAYS</p>
     <p class="subtitle-text">y'all genuinely couldn't stop yapping(study for CS108 guys)</p>
     <table class="stats-table">
     <thead>
       <tr>
         <th>Rank</th>
         <th class="text-start">Date</th>
         <th class="text-end">Count</th>
        </tr>
      </thead>
      <tbody>`;

    const days = data.group.busiest_days;

    for (let i = 0; i < days.length; i++) {
      const date = days[i][0];
      const count = days[i][1];

      let rowClass = "";
      if (i === 0) rowClass = "first";
      else if (i === 1) rowClass = "second";
      else if (i === 2) rowClass = "third";
      emoji_list = ["🥇", "🥈", "🥉", "4", "5"];

      html += `
    <tr class="${rowClass}">
      <td class="rank">${emoji_list[i]}</td>
      <td class="date">${date}</td>
      <td class="count">${count}</td>
    </tr>`;
    }

    html += `
      </tbody>
    </table>`;

    slides.push(html);
    background_classes.push("busy-day");

    // 2. Ghost Slide
    let html2 = `
    <p class="title-text">GHOSTS</p>
    <p class="subtitle-text">who got left on read the most 👻</p>
    <table class="stats-table ghost-table">
    <thead>
      <tr>
        <th>Rank</th>
        <th class="text-start">Name</th>
         <th class="text-end">Ghosting value</th>
       </tr>
     </thead>
     <tbody>`;

    const ghosts = data.group.ghosts;

    for (let i = 0; i < ghosts.length; i++) {
      const name = ghosts[i][0];
      const count = ghosts[i][1];
      let rowClass = "";
      if (i === 0) rowClass = "first";
      else if (i === 1) rowClass = "second";
      else if (i === 2) rowClass = "third";
      emoji_list = ["👻", "2", "3", "4", "5"];

      html2 += `
     <tr class="${rowClass}">
       <td class="rank">${emoji_list[i]}</td>
       <td class="date">${name}</td>
       <td class="count">${count}</td>
     </tr>`;
    }

    html2 += `
       </tbody>
     </table>`;

    slides.push(html2);
    background_classes.push("ghost");

    // 3. Hypeness Slide
    let html3 = `
    <p class="title-text">HYPEST PERSONS</p>
    <p class="subtitle-text">always first to reply, no life confirmed ⚡</p>
    <table class="stats-table hype-table">
    <thead>
      <tr>
        <th>Rank</th>
        <th class="text-start">Name</th>
        <th class="text-end">Time to respond(min)</th>
       </tr>
     </thead>
     <tbody>`;

    const hypeness = data.group.hype_persons;
    for (let i = 0; i < hypeness.length; i++) {
      const name = hypeness[i][0];
      const count = hypeness[i][1];
      let rowClass = "";
      if (i === 0) rowClass = "first";
      else if (i === 1) rowClass = "second";
      else if (i === 2) rowClass = "third";
      emoji_list = ["🔥", "2", "3", "4", "5"];

      html3 += `
     <tr class="${rowClass}">
       <td class="rank">${emoji_list[i]}</td>
       <td class="date">${name}</td>
       <td class="count">${count}</td>
     </tr>`;
    }

    html3 += `
       </tbody>
     </table>`;

    slides.push(html3);
    background_classes.push("hype");

    // 4. Night Owl Slide
    let html4 = `
    <p class="title-text">NIGHT OWLS</p>
    <p class="subtitle-text">who was texting at 3am 🌙</p>
    <table class="stats-table owl-table">
    <thead>
      <tr>
        <th>Rank</th>
        <th class="text-start">Name</th>
        <th class="text-end">Night activity value</th>
       </tr>
     </thead>
     <tbody>`;

    const night_owls = data.group.night_owls;
    for (let i = 0; i < night_owls.length; i++) {
      const name = night_owls[i][0];
      const count = night_owls[i][1];
      let rowClass = "";
      if (i === 0) rowClass = "first";
      else if (i === 1) rowClass = "second";
      else if (i === 2) rowClass = "third";
      emoji_list = ["🦉", "2", "3", "4", "5"];

      html4 += `
     <tr class="${rowClass}">
       <td class="rank">${emoji_list[i]}</td>
       <td class="date">${name}</td>
       <td class="count">${count}</td>
     </tr>`;
    }

    html4 += `
       </tbody>
     </table>`;

    slides.push(html4);
    background_classes.push("owl");

    // 5. Conversation Starter Slide
    let html5 = `
    <p class="title-text">CONVERSATION STARTERS</p>
    <p class="subtitle-text">who saved the dead chat every time 🔥</p>
    <table class="stats-table convo-table">
    <thead>
      <tr>
        <th>Rank</th>
        <th class="text-start">Name</th>
        <th class="text-end">Convo value</th>
       </tr>
     </thead>
     <tbody>`;
    const convo_starters = data.group.conversation_starters;
    for (let i = 0; i < convo_starters.length; i++) {
      const name = convo_starters[i][0];
      const count = convo_starters[i][1];
      let rowClass = "";
      if (i === 0) rowClass = "first";
      else if (i === 1) rowClass = "second";
      else if (i === 2) rowClass = "third";
      emoji_list = ["💬", "2", "3", "4", "5"];

      html5 += `
      <tr class="${rowClass}">
        <td class="rank">${emoji_list[i]}</td>
        <td class="date">${name}</td>
        <td class="count">${count}</td>
      </tr>`;
    }

    html5 += `
       </tbody>
     </table>`;

    slides.push(html5);
    background_classes.push("convo");

    // 7. Person Selector Slide — clicking a name jumps to their profile
    const persons = Object.keys(data.persons);
    const person_slide_start = slides.length + 1; // Needs to account for comparison slide too now
    let selector_html = `
      <p class="title-text">PERSONAL WRAPS</p>
      <p class="subtitle-text">tap a name to jump to their stats 👇</p>
      <div class="person-selector">
        ${persons
          .map(
            (name, i) => `
          <button class="person-btn" onclick="goto_person(${
            person_slide_start + i + 1 // +1 because we are adding the comparison slide before person slides
          })">${name}</button>
        `,
          )
          .join("")}
      </div>
    `;
    slides.push(selector_html);
    background_classes.push("owl");
  }
  function build_comparison_slide() {
    const persons = Object.keys(data.persons);
    let optionsHTML = `<option value="">Select Person...</option>`;
    persons.forEach((name) => {
      optionsHTML += `<option value="${name}">${name}</option>`;
    });

    let html = `
      <div class="slide-container d-flex flex-column align-items-center w-100 h-100 p-4">
        <p class="title-text text-center">HEAD TO HEAD</p>
        <p class="subtitle-text text-center mb-4">Pick up to 4 people to compare stats</p>

        <div class="d-flex gap-2 mb-4 justify-content-center flex-wrap w-100">
          <select class="form-select bg-dark text-white border-secondary person-select shadow-sm" style="max-width: 140px;">${optionsHTML}</select>
          <select class="form-select bg-dark text-white border-secondary person-select shadow-sm" style="max-width: 140px;">${optionsHTML}</select>
          <select class="form-select bg-dark text-white border-secondary person-select shadow-sm" style="max-width: 140px;">${optionsHTML}</select>
          <select class="form-select bg-dark text-white border-secondary person-select shadow-sm" style="max-width: 140px;">${optionsHTML}</select>
        </div>

        <table class="stats-table w-100" id="compare-table" style="display: none;">
          <thead>
            <tr id="compare-headers">
              </tr>
          </thead>
          <tbody id="compare-body">
            </tbody>
        </table>
      </div>`;

    slides.push(html);
    background_classes.push("convo"); // Assign a background gradient
  }
  // -----------------------------------

  window.goto_person = function (target_index) {
    index = target_index;
    render_slide(index);
  };

  function build_person_slides() {
    let t_idx = 0;

    for (const [name, stats] of Object.entries(data.persons)) {
      const theme = themes[t_idx % themes.length];

      let html = `
      <p class="title-text">${name}'S WRAPPED</p>
      <p class="subtitle-text">your personal stats 📊</p>
      <div class="row w-100 justify-content-center slide-container mx-auto">
        
        <div class="col-12 col-lg-6 mb-4 d-flex flex-column align-items-center">
          <table class="stats-table ${theme.tb} w-100">
            <thead>
              <tr>
                <th class="text-start">Stat</th>
                <th class="text-end">Value</th>
               </tr>
             </thead>
             <tbody>
               <tr><td class="text-start">Total Messages</td><td class="text-end">${stats.total_messages}</td></tr>
               <tr><td class="text-start">Total Words</td><td class="text-end">${stats.total_words}</td></tr>
               <tr><td class="text-start">Avg Response Time</td><td class="text-end">${stats.avg_response_time} min</td></tr>
               <tr><td class="text-start">Activity Focus</td><td class="text-end">${stats.activity_concentration}%</td></tr>
               <tr><td class="text-start">Top Emojis</td><td class="text-end">${stats.most_used_emojis.join(" ")}</td></tr>
             </tbody>
           </table>
        </div>

        <div class="col-12 col-lg-6 mb-4 d-flex flex-column align-items-center">
          <table class="stats-table ${theme.tb} w-100">
            <thead>
              <tr>
                <th class="text-start">Achievement</th>
                <th class="text-end">Rank</th>
               </tr>
             </thead>
             <tbody>`;

      const sortedAchievements = [...stats.person_achievements].sort(
        // Lambda functions are fun
        (a, b) => a[1] - b[1],
      );

      for (let i = 0; i < sortedAchievements.length; i++) {
        const achName = sortedAchievements[i][0];
        const rankNum = sortedAchievements[i][1];

        let rowClass = "";
        let rankText = rankNum;
        if (rankNum === 1) {
          rowClass = "first";
          rankText = "🥇 1";
        } else if (rankNum === 2) {
          rowClass = "second";
          rankText = "🥈 2";
        } else if (rankNum === 3) {
          rowClass = "third";
          rankText = "🥉 3";
        }

        html += ` <tr class="${rowClass}">
          <td class="text-start">${achName}</td>
          <td class="text-end">${rankText}</td>
        </tr>`;
      }
      if (sortedAchievements.length == 0)
        html = `lock in, u have zero achivements 🥀`;

      html += `
             </tbody>
           </table>
        </div>

      </div>`;

      slides.push(html);
      background_classes.push(theme.bg);
      t_idx++;
    }
  }

  function render_progress() {
    progress_bar.innerHTML = slides
      .map(
        (_, i) =>
          `<div class="progress-bar-wrapper"><div class="progress-bar-fill" id="progress-${i}"></div></div>`,
      )
      .join("");
  }

  function render_slide(index) {
    if (index >= slides.length) {
      location.reload();
      return;
    }
    slide.innerHTML = slides[index];
    slide_screen.className = `screen d-flex flex-column w-100 h-100 position-absolute top-0 start-0 z-2 ${background_classes[index % background_classes.length]}`;

    slide.classList.remove("slide-anim");
    // delay for reloading slide animation
    setTimeout(() => {
      slide.classList.add("slide-anim");
    }, 10);

    slides.forEach((_, i) => {
      bar = document.getElementById(`progress-${i}`);
      if (i <= index) bar.classList.add("done");
      else bar.classList.remove("done");
    });
  }

  if (start_btn) {
    start_btn.addEventListener("click", () => {
      build_group_slides();
      build_person_slides();
      build_comparison_slide();
      render_progress();
      landing.classList.replace("d-flex", "d-none");
      slide_screen.classList.remove("d-none");
      render_slide(index);
    });
  }

  slide_screen.addEventListener("click", (e) => {
    if (e.target.closest("table")) return;
    if (e.target.closest(".person-btn")) return; // don't advance when clicking person buttons
    if (e.target.closest("select")) return; // NEW: don't advance when clicking dropdowns

    const xpos = e.clientX;
    const swidth = window.innerWidth;

    if (xpos < swidth * 0.3) {
      if (index > 0) {
        index--;
        render_slide(index);
      }
    } else {
      index++;
      render_slide(index);
    }
  });
});
