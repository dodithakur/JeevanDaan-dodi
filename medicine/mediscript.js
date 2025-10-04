console.log("Medicine Script loaded");

let medicines = [];

// Fetch data from data.json
fetch('./medicine/data.json')
    .then((response) => response.json())
    .then((data) => {
        medicines = data;
        console.log("Data loaded:", medicines);
    })
    .catch((error) => console.error("Error loading data:", error));

// Function to normalize text for broader matching
function normalizeText(text) {
    return text ? text.toLowerCase() : ''; // No space trimming to preserve word integrity
}

// Function to perform search
function searchMedicines(keyword) {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = ""; // Clear previous results

    if (!keyword) {
        resultDiv.innerHTML = `<p>Please enter a keyword to search.</p>`;
        return;
    }

    if (medicines.length === 0) {
        resultDiv.innerHTML = `<p>Data not loaded yet. Try again later.</p>`;
        return;
    }

    const matches = medicines.filter((med) => {
        const nameMatch = normalizeText(med["Medicine Name"]).includes(normalizeText(keyword));
        const compositionMatch = normalizeText(med["Composition"]).includes(normalizeText(keyword));
        return nameMatch || compositionMatch;
    });

    if (matches.length > 0) {
        matches.forEach((medicine) => {
            const tile = document.createElement("div");
            tile.className = "tile";
            tile.innerHTML = `
                <img src="${medicine['Image URL']}" alt="${medicine['Medicine Name']}">
                <h3>${medicine['Medicine Name']}</h3>
            `;
            tile.addEventListener("click", () => openModal(medicine));
            resultDiv.appendChild(tile);
        });
    } else {
        resultDiv.innerHTML = `<p>No matching medicines found. Try another keyword.</p>`;
    }
}

// Add search button functionality
document.getElementById("searchBtn").addEventListener("click", () => {
    const keyword = document.getElementById("medicineName").value.trim();
    searchMedicines(keyword);
});

// Add suggested search chips functionality
const frequentSearchTerms = [
    // Active Ingredients
    "Cetirizine",
    "Paracetamol",
    "Ibuprofen",
    "Metformin",
    "Ranitidine",
    "Aspirin",
    "Azithromycin",
    "Clavulanic Acid",
    "Ciprofloxacin",
    "Omeprazole",
    "Levocetirizine",
    "Ambroxol",
    "Diclofenac",
    "Prednisolone",

    // Common Brand Names
    "Crocin",
    "Augmentin",
    "Allegra",
    "Zyrtec",
    "Dolo",
    "Benadryl",
];


const suggestedSearchesContainer = document.getElementById('suggestedSearches');
frequentSearchTerms.forEach(term => {
    const chip = document.createElement('button');
    chip.className = 'search-chip';
    chip.innerText = term;
    chip.addEventListener('click', () => {
        document.getElementById('medicineName').value = term;
        searchMedicines(term);
    });
    suggestedSearchesContainer.appendChild(chip);
});

// Function to open modal with details
function openModal(medicine) {
    const modal = document.getElementById("modal");
    const modalDetails = document.getElementById("modalDetails");

    // Lock background scroll
    document.body.style.overflow = "hidden";

    modal.style.display = "flex";
    modalDetails.innerHTML = `
        <h2>${medicine['Medicine Name']}</h2>
        <img src="${medicine['Image URL']}" alt="${medicine['Medicine Name']}">
        <p><strong>Composition:</strong> ${medicine['Composition']}</p>
        <p><strong>Uses:</strong> ${medicine['Uses']}</p>
        <p><strong>Side Effects:</strong> ${medicine['Side_effects']}</p>
        <p><strong>Manufacturer:</strong> ${medicine['Manufacturer']}</p>
        <p><strong>Reviews:</strong> Excellent: ${medicine['Excellent Review %']}%, Average: ${medicine['Average Review %']}%, Poor: ${medicine['Poor Review %']}%</p>
    `;
}

function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";

    // Restore background scroll
    document.body.style.overflow = "auto";
}

// Close modal when clicking outside
window.addEventListener("click", (event) => {
    const modal = document.getElementById("modal");
    if (event.target === modal) {
        closeModal();
    }
});


// Close modal functionality
document.querySelector(".close").addEventListener("click", () => {
    document.getElementById("modal").style.display = "none";
});

// Close modal when clicking outside of it
window.addEventListener("click", (event) => {
    const modal = document.getElementById("modal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
});
