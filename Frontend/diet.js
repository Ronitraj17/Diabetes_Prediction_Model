const params = new URLSearchParams(window.location.search);
const risk = parseInt(params.get("risk")) || 0;

const riskDisplay = document.getElementById("riskDisplay");
const dietContent = document.getElementById("dietContent");

// 1. Determine the Theme based on Risk
let theme = {
    color: 'slate',
    title: 'General Wellness',
    label: 'Standard Diet',
    icon: '📋'
};

if (risk < 30) {
    theme = { color: 'green', title: 'LOW RISK DIET', label: 'PREVENTATIVE CARE', icon: '✅' };
} else if (risk < 70) {
    theme = { color: 'amber', title: 'MODERATE RISK DIET', label: 'PRE-DIABETIC CARE', icon: '⚠️' };
} else {
    theme = { color: 'red', title: 'HIGH RISK DIET', label: 'INTENSIVE CARE', icon: '🚨' };
}

// 2. Update the Top Badge
riskDisplay.innerHTML = `
    <span class="text-${theme.color}-600">Risk Assessment: ${risk}%</span> 
    <span class="mx-2 opacity-20">|</span> 
    <span class="text-slate-500">${theme.label}</span>
`;
riskDisplay.className = `mb-8 p-4 rounded-2xl bg-${theme.color}-50/50 border border-${theme.color}-200 text-center text-[14px] font-black uppercase tracking-widest shadow-sm`;

// 3. Prepare the Content Logic
let dietItems = [];
let headerText = theme.title;

if (risk < 30) {
    dietItems = [
{
    category: "Breakfast",
    value: `
      <ul class="list-disc pl-5 space-y-1">
        <li>Vegetable Oats + Milk</li>
        <li>Poha with Peanuts</li>
        <li>2 Multigrain Toast + Peanut Butter</li>
        <li>Idli + Sambar</li>
      </ul>
    `
  },        
{
    category: "Lunch",
    value: `
      <ul class="list-disc pl-5 space-y-1">
        <li>2 Rotis or 1 Cup Rice</li>
        <li>1 Bowl dal / Rajma / Paneer</li>
        <li>Cooked Vegetables</li>
        <li>Large Salad</li>
        <li>Curd</li>
      </ul>
    `
  },        
{
    category: "Dinner",
    value: `
      <ul class="list-disc pl-5 space-y-1">
        <li>2 Rotis +Sabzi</li>
        <li>Soup + Salad + Paneer</li>
        <li>Rice + Dal + Vegetables</li>
      </ul>
    `
},
{
    category: "Healthy Tips",
    value: `
      <ul class="list-disc pl-5 space-y-1">
        <li>Exercise 30 minutes daily</li>
        <li>Drink 2.5–3 liters water</li>
        <li>Sleep 7–8 hours</li>
        <li>Limit junk food and sugary drinks</li>
      </ul>
    `
}
    ];
} else if (risk < 70) {
    dietItems = [
{
    category: "Breakfast",
    value: `
      <ul class="list-disc pl-5 space-y-1">
        <li>Vegetable Oats + Boiled Egg</li>
        <li>Besan Chilla + Curd</li>
        <li>2 Multigrain Toast + Paneer Bhurji</li>
        <li>Idli + Sambar (moderate portion)</li>
      </ul>
    `
  },
{
    category: "Lunch",
    value: `
      <ul class="list-disc pl-5 space-y-1">
        <li>2 Multigrain Rotis or 1 Cup Brown Rice</li>
        <li>1 Bowl dal / Grilled chicken / Paneer</li>
        <li>Large Salad</li>
        <li>Cooked vegetables</li>
        <li>Curd (unsweetened)</li>
      </ul>
    `
},
{
    category: "Dinner",
    value: `
      <ul class="list-disc pl-5 space-y-1">
        <li>2 Rotis + sabzi + Protein</li>
        <li>Soup + Paneer/chicken + salad</li>
        <li>Stir-fry vegetables + paneer</li>
      </ul>
    `
},
{
    category: "Important Tips",
    value: `
      <ul class="list-disc pl-5 space-y-1">
        <li>Avoid sweets, sugary drinks and fried foods</li>
        <li>Walk 30–40 minutes daily</li>
        <li>Drink 2.5–3 liters water</li>
        <li>Eat meals on time</li>
      </ul>
    `
}
    ];
} else {
    dietItems = [
{ 
  category: "Breakfast", 
  value: `
    <ul class="list-disc pl-5 space-y-1">
      <li>Vegetable oats + Boiled egg</li>
      <li>Besan chilla + Curd</li>
      <li>2 Multigrain toast + paneer bhurji</li>
      <li>Idli + sambar (moderate portion)</li>
    </ul>
  `
},     
{
  category: "Lunch",
  value: `
    <ul class="list-disc pl-5 space-y-1">
      <li>2 Multigrain Rotis or 1 Cup Brown Rice</li>
      <li>1 Bowl Dal / Grilled Chicken / Paneer</li>
      <li>Large Salad</li>
      <li>Cooked Vegetables</li>
      <li>Curd (unsweetened)</li>
    </ul>
  `
},
{
  category: "Dinner",
  value: `
    <ul class="list-disc pl-5 space-y-1">
      <li>2 Rotis + Sabzi + Protein</li>
      <li>Soup + Paneer/Chicken + Salad</li>
      <li>Stir-Fry Vegetables + Paneer</li>
    </ul>
  `
},        
{
    category: "Strict Avoid",
    value: `
      <ul class="list-disc pl-5 space-y-1">
        <li>Sweets and Desserts</li>
        <li>Sugary Drinks and Fruit Juices</li>
        <li>White Bread and Bakery Foods</li>
        <li>Deep Fried Snacks</li>
        <li>Late Night Heavy Meals</li>
      </ul>
    `
  },
{
    category: "Health Tips",
    value: `
      <ul class="list-disc pl-5 space-y-1">
        <li>Walk 30–45 minutes daily</li>
        <li>Monitor blood sugar regularly</li>
        <li>Drink 2.5–3 liters water</li>
        <li>Eat meals on time</li>
        <li>Consult doctor regularly</li>
      </ul>
    `
    }
    ];
}

let html = `
    <div class="flex items-center mb-6">
        <div class="p-3 bg-${theme.color}-100 rounded-xl mr-4 shadow-sm border border-${theme.color}-200">
            <span class="text-xl">${theme.icon}</span>
        </div>
        <h2 class="text-xl font-black text-slate-800 uppercase tracking-tight">${headerText}</h2>
    </div>
    <div class="grid gap-4">
`;

dietItems.forEach(item => {
    html += `
        <div class="flex flex-col p-4 bg-white/60 rounded-2xl border border-white shadow-sm hover:shadow-md transition-all">
            <span class="text-[12px] font-black uppercase text-${theme.color}-600 tracking-widest mb-1">${item.category}</span>
            <span class="text-slate-800 font-bold text-sm">${item.value}</span>
        </div>
    `;
});

html += `</div>`;

dietContent.innerHTML = html;