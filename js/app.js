const firebaseConfig = {
  apiKey: "AIzaSyBKimrt9AIrJZvaFVDmU-vGrUMkOahSxlw",
  authDomain: "ts-firebase-main.firebaseapp.com",
  projectId: "ts-firebase-main",
  storageBucket: "ts-firebase-main.appspot.com",
  messagingSenderId: "715010324683",
  appId: "1:715010324683:web:1c6143e990207447ec434e",
};

const openModal = document.getElementById("openRegisterModal");
const modal = document.getElementById("modal");
const updateModal = document.getElementById("modal-update");
const updateForm = document.getElementById("update-form");
const closeUpdateModal = document.getElementById("closeUpdateModal");
const closeModal = document.getElementById("closeRegisterModal");
const registerForm = document.getElementById("register-form");
const studentsTable = document.getElementById("students-table");
firebase.initializeApp(firebaseConfig);
const studentRef = firebase.database().ref("students");

const showRegisterModal = () => {
  modal.classList.toggle("is-active");
};

openModal.addEventListener("click", showRegisterModal);
closeModal.addEventListener("click", showRegisterModal);

const deleteStudent = (uid) => {
  firebase.database().ref(`students/${uid}`).remove();
};

const showUpdateModal = () => {
  updateModal.classList.toggle("is-active");
};

closeUpdateModal.addEventListener("click", showUpdateModal);

window.addEventListener("DOMContentLoaded", async (e) => {
  await studentRef.on("value", (snapshot) => {
    studentsTable.innerHTML = "";
    snapshot.forEach((childSnapshot) => {
      let studentData = childSnapshot.val();
      if (studentData) { // Verificar que studentData no sea null
        studentsTable.innerHTML += `
          <tr>
            <td>${studentData.Nombre}</td>
            <td>${studentData.Apellidos}</td>
            <td>${studentData.Matricula}</td>
            <td>${studentData.Plan_de_Estudio}</td>
            <td>${studentData.Semestre}</td>
            <td>${studentData.Materia}</td>
            <td>${studentData.Telefono}</td>
            <td>${studentData.Correo_Electronico}</td>
            <td>
              <button class="button is-warning" data-id="${studentData.Uid}">
                <i class="fas fa-pencil-alt"></i>
              </button>
              <button class="button is-danger" data-id="${studentData.Uid}">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>`;
      }

      const updateButtons = document.querySelectorAll(".is-warning");
      updateButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
          showUpdateModal();
          const uid = e.currentTarget.dataset.id;
          firebase.database().ref(`students/${uid}`).once("value").then((snapshot) => {
            const data = snapshot.val();
            if (data) {
              updateForm["nombre"].value = data.Nombre || "";
              updateForm["apell"].value = data.Apellidos || "";
              updateForm["matric"].value = data.Matricula || "";
              updateForm["plan"].value = data.Plan_de_Estudio || "";
              updateForm["semestre"].value = data.Semestre || "";
              updateForm["materia"].value = data.Materia || "";
              updateForm["cel"].value = data.Telefono || "";
              updateForm["email"].value = data.Correo_Electronico || "";
            }
          }).catch((error) => {
            console.error("Error al obtener los datos del estudiante:", error);
          });

          updateForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const nombre = updateForm["nombre"].value;
            const apellido = updateForm["apell"].value;
            const matricula = updateForm["matric"].value;
            const planEstudio = updateForm["plan"].value;
            const semestre = updateForm["semestre"].value;
            const materia = updateForm["materia"].value;
            const telefono = updateForm["cel"].value;
            const correo = updateForm["email"].value;

            firebase.database().ref(`students/${uid}`).update({
              Nombre: nombre,
              Apellidos: apellido,
              Matricula: matricula,
              Plan_de_Estudio: planEstudio,
              Semestre: semestre,
              Materia: materia,
              Telefono: telefono,
              Correo_Electronico: correo,
            });
            showUpdateModal();
          }, { once: true });
        });
      });

      const deleteButtons = document.querySelectorAll(".is-danger");
      deleteButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
          deleteStudent(e.currentTarget.dataset.id);
        });
      });
    });
  });
});

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = registerForm["nombre"].value;
  const apellido = registerForm["apell"].value;
  const matricula = registerForm["matric"].value;
  const planEstudio = registerForm["plan"].value;
  const semestre = registerForm["semestre"].value;
  const materia = registerForm["materia"].value;
  const telefono = registerForm["cel"].value;
  const correo = registerForm["email"].value;

  const registerStudent = studentRef.push();

  registerStudent.set({
    Uid: registerStudent.key,
    Nombre: nombre,
    Apellidos: apellido,
    Matricula: matricula,
    Plan_de_Estudio: planEstudio,
    Semestre: semestre,
    Materia: materia,
    Telefono: telefono,
    Correo_Electronico: correo,
  });

  showRegisterModal();
});
