/* ===============================
   Load All Categories
=================================*/
const loadpets = () => {
  fetch("https://openapi.programming-hero.com/api/peddy/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories));
};

// create category button 
const displayCategories = (categories) => {
  const buttoncontainer = document.getElementById("Btn-container");
  buttoncontainer.innerHTML = "";

  categories.forEach((item) => {
    const btndiv = document.createElement("div");

    btndiv.innerHTML = `
      <button onclick="loadCategoryBtn('${item.category}')"
        class="flex items-center gap-3 border border-sky-500 text-sky-500 px-5 py-3 rounded-xl hover:bg-sky-500 hover:text-white transition"
      >
        <img src="${item.category_icon}" class="w-6 h-6" />
        <span>${item.category}</span>
      </button>
    `;

    buttoncontainer.appendChild(btndiv);
  });
};

/* ===============================
   Spinner Control
=================================*/
const manageSpinner = (status) => {
  const spinner = document.getElementById("spinner");
  const container = document.getElementById("card-container");

  if (status) {
    spinner.classList.remove("hidden");
    container.classList.add("hidden");
  } else {
    spinner.classList.add("hidden");
    container.classList.remove("hidden");
  }
};

/* 
   Load All Pets
*/
const loadAllPets = () => {
  manageSpinner(true);

  fetch("https://openapi.programming-hero.com/api/peddy/pets")
    .then((res) => res.json())
    .then((data) => {
      displayCards(data.pets);
      manageSpinner(false);
    });
};

/* 
   Load Pets By Category
*/
const loadCategoryBtn = (category) => {
  manageSpinner(true);

  fetch(`https://openapi.programming-hero.com/api/peddy/category/${category}`)
    .then((res) => res.json())
    .then((data) => {
      displayCards(data.data);
      manageSpinner(false);
    })
    .catch((error) => {
      console.log(error);
      manageSpinner(false);
    });
};

/* 
   jodi categori te kono card na thake tahole 
*/
const displayCards = (pets) => {
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";

  if (!pets || pets.length === 0) {
    cardContainer.innerHTML = `
      <div class="col-span-full flex flex-col items-center text-center  p-10 rounded-xl">
        <img src="./error.webp" alt="">
        <p class="text-red-600">
          Please try another category.
        </p>
      </div>
    `;
    return;
  }

  pets.forEach((pet) => {
    const carddiv = document.createElement("div");

    carddiv.innerHTML = `
     <div class="card bg-base-100 w-96 shadow-sm">
        <figure>
          <img src="${pet.image}" alt="${pet.pet_name}" />
        </figure>
        <div class="card-body">
          <h2 class="card-title">
            ${pet.pet_name}
          </h2>
          <p>${pet.breed ?? "কোন তথ্য পাওয়া যায়নি"}</p>
          <p>Date of Birth: ${pet.date_of_birth ?? "কোন তথ্য পাওয়া যায়নি"}</p>
          <p>Gender: ${pet.gender ?? "কোন তথ্য পাওয়া যায়নি"}</p>
          <p>Price: $${pet.price ?? "N/A"}</p>
          <div class="card-actions justify-end">
           <div onclick="handleLike('${pet.image}')" 
     class="badge badge-outline cursor-pointer">
  Like
</div>

            <div onclick="openAdoptModal(this)" class="badge badge-outline">Adopt</div>
            <div onclick="loadcardDetail(${pet.petId})" class="badge badge-outline">Details</div>
          </div>
        </div>
      </div>
    `;

    cardContainer.appendChild(carddiv);
  });
};

/* ===============================
   Load Pet Details
=================================*/
const loadcardDetail = async (petId) => {
  const res = await fetch(
    `https://openapi.programming-hero.com/api/peddy/pet/${petId}`
  );
  const data = await res.json();

  displaycarddetailes(data.petData);
};

const displaycarddetailes = (petData) => {
  const detailsbox = document.getElementById("details-container");

  detailsbox.innerHTML = `
    <h2 class="text-2xl font-bold mb-2">${petData.pet_name}</h2>
    <img src="${petData.image ?? 'https://via.placeholder.com/150'}" 
         class="w-48 h-48 mb-4 rounded-lg"/>
    <p><strong>Breed:</strong> ${petData.breed ?? "কোন তথ্য পাওয়া যায়নি"}</p>
    <p><strong>Date of Birth:</strong> ${petData.date_of_birth ?? "কোন তথ্য পাওয়া যায়নি"}</p>
    <p><strong>Gender:</strong> ${petData.gender ?? "কোন তথ্য পাওয়া যায়নি"}</p>
    <p><strong>Price:</strong> $${petData.price ?? "N/A"}</p>
    <p class="max-h-40 overflow-y-auto">
      <strong>Details:</strong> ${petData.pet_details ?? "কোন তথ্য পাওয়া যায়নি"}
    </p>
    <p><strong>Vaccinated:</strong> ${petData.vaccinated_status ?? "কোন তথ্য পাওয়া যায়নি"}</p>
  `;

  document.getElementById("my_modal_5").showModal();
};

/* ===============================
   Adopt Button Countdown
=================================*/
const openAdoptModal = (button) => {
  const modal = document.getElementById("adopt_modal");
  const countdownEl = document.getElementById("adopt_countdown");
  const okBtn = document.getElementById("adopt_ok_btn");

  modal.showModal();

  let count = 3;
  countdownEl.innerText = count;
  okBtn.classList.add("hidden");
  button.disabled = true;

  const countdown = setInterval(() => {
    count--;

    if (count > 0) {
      countdownEl.innerText = count;
    } else {
      clearInterval(countdown);
      button.innerText = "Adopted";
      button.classList.remove("badge-outline");
      button.classList.add("badge-success");

      countdownEl.innerText = "Congratulations!";
      okBtn.classList.remove("hidden");
    }
  }, 1000);
};


// Like Button Function 
const handleLike = (imageUrl) => {
  const rightSection = document.getElementById("right-section");

  const imgDiv = document.createElement("div");

  imgDiv.innerHTML = `
    <img src="${imageUrl}" 
         class="w-full h-32 object-cover rounded-lg shadow-md"/>
  `;

  rightSection.appendChild(imgDiv);
};
  





/* 
   Function call 
*/
loadAllPets();
loadpets();

