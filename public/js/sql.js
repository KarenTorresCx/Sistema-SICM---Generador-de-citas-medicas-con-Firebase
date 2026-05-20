const baseUrl = 'http://localhost:5000';

function showSection(section) {
  document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
  document.getElementById(`section-${section}`).classList.remove('hidden');

  const titles = {
    home: 'Inicio - Citas Próximas',
    patients: 'Pacientes',
    doctors: 'Médicos',
    agenda: 'Agenda - Nueva Cita'
  };
  document.getElementById('page-title').textContent = titles[section];

  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  const active = document.getElementById(`menu-${section}`);
  if (active) active.classList.add('active');

  if (section === 'patients') loadPatients();
  if (section === 'doctors') loadDoctors();
  if (section === 'home') loadUpcomingAppointments();
}

function showSuccessModal() {
  document.getElementById('successModal').classList.remove('hidden');
  document.getElementById('successModal').classList.add('flex');
}

function hideSuccessModal() {
  const modal = document.getElementById('successModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function showTable(data, containerId, entity) {
  const container = document.getElementById(containerId);

  if (!data || data.length === 0) {
    container.innerHTML = `<p class="text-gray-400 italic p-8 text-center">No hay registros aún</p>`;
    return;
  }

  let html = `
    <div class="overflow-x-auto">
      <table class="min-w-full text-sm table-auto border-collapse">
        <thead class="bg-slate-100">
          <tr>
  `;

  Object.keys(data[0]).forEach(key => {
    html += `<th class="px-4 py-3 text-left whitespace-nowrap">${key}</th>`;
  });

  html += `<th class="px-4 py-3 text-center whitespace-nowrap">Acción</th></tr></thead><tbody>`;

  data.forEach(row => {
    const id = row.patient_id || row.doctor_id || row.appointment_id;

    html += `<tr class="border-t hover:bg-blue-50">`;

    Object.values(row).forEach(v => {
      html += `<td class="px-4 py-3 max-w-[150px] truncate">${v === null ? '-' : v}</td>`;
    });

    html += `
      <td class="px-4 py-3 text-center whitespace-nowrap">
        <button onclick="delete${entity}(${id})" class="text-red-600 hover:text-red-800">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    </tr>`;
  });

  html += `</tbody></table></div>`;

  container.innerHTML = html;
}

async function deleteAppointment(id) {
  if (!confirm('¿Estás seguro de eliminar esta cita?')) return;
  try {
    await fetch(`${baseUrl}/appointments/${id}`, { method: 'DELETE' });
    alert('Cita eliminada correctamente');
    loadUpcomingAppointments();
  } catch (e) {
    alert('Error al eliminar la cita');
  }
}

async function deletePatient(id) {
  if (!confirm('¿Estás seguro de eliminar este paciente?')) return;
  try {
    await fetch(`${baseUrl}/patients/${id}`, { method: 'DELETE' });
    alert('Paciente eliminado correctamente');
    loadPatients();
  } catch (e) {
    alert('Error al eliminar');
  }
}

async function deleteDoctor(id) {
  if (!confirm('¿Estás seguro de eliminar este médico?')) return;
  try {
    await fetch(`${baseUrl}/doctors/${id}`, { method: 'DELETE' });
    alert('Médico eliminado correctamente');
    loadDoctors();
  } catch (e) {
    alert('Error al eliminar');
  }
}

async function createPatient() {
  const data = {
    name: document.getElementById('p_name').value,
    last_name: document.getElementById('p_last_name').value,
    doc_identity: document.getElementById('p_doc_identity').value,
    phone: document.getElementById('p_phone').value,
    email: document.getElementById('p_email').value,
    birthdate: document.getElementById('p_birthdate')?.value || null
  };
  await postData('/patients', data, loadPatients);
}

async function createDoctor() {
  const data = {
    name: document.getElementById('d_name').value,
    last_name: document.getElementById('d_last_name').value,
    phone: document.getElementById('d_phone').value,
    email: document.getElementById('d_email').value
  };
  await postData('/doctors', data, loadDoctors);
}

async function createAppointment() {
  const data = {
    date: document.getElementById('a_date').value,
    time: document.getElementById('a_time').value,
    patient_id: parseInt(document.getElementById('a_patient_id').value),
    doctor_id: parseInt(document.getElementById('a_doctor_id').value),
    note: document.getElementById('a_note').value || null
  };

  try {
    const res = await fetch(baseUrl + '/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const text = await res.text();
    showSuccessModal();
    loadUpcomingAppointments();
  } catch (e) {
    alert('Error al guardar cita');
  }
}

async function postData(endpoint, data, callback) {
  try {
    await fetch(baseUrl + endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    callback();
  } catch (e) {
    alert('Error: ' + e.message);
  }
}

async function loadPatients() {
  const res = await fetch(baseUrl + '/patients');
  const data = await res.json();
  showTable(data, 'patients-table', 'Patient');
}

async function loadDoctors() {
  const res = await fetch(baseUrl + '/doctors');
  const data = await res.json();
  showTable(data, 'doctors-table', 'Doctor');
}

async function loadUpcomingAppointments() {

  const res = await fetch(baseUrl + '/appointments');

  const data = await res.json();

  const container =
  document.getElementById('upcoming-appointments');

  let html = '';

  data.slice(0, 6).forEach(cita => {

    html += `

      <div class="bg-white rounded-3xl shadow p-6 card">

        <div class="flex justify-between items-start">

          <div>

            <p class="text-lg font-semibold text-gray-800">
              ${cita.date} • ${cita.time}
            </p>

            <p class="text-sm text-gray-500 mt-1">
              Paciente: ${cita.patient_id}
              |
              Médico: ${cita.doctor_id}
            </p>

            ${cita.note
              ? `
                <p class="text-sm text-gray-400 mt-3 italic">
                  ${cita.note}
                </p>
              `
              : ''
            }

          </div>

          <div class="flex flex-col items-end gap-3">

            <span
              class="px-4 py-1 rounded-3xl text-xs font-medium
              ${
                cita.state === 'confirmada'
                ? 'bg-green-100 text-green-700'
                : cita.state === 'cancelada'
                ? 'bg-red-100 text-red-700'
                : 'bg-yellow-100 text-yellow-700'
              }"
            >

              ${cita.state}

            </span>

            <button
              onclick="deleteAppointment(${cita.appointment_id})"
              class="text-red-500 hover:text-red-700 transition text-lg"
              title="Eliminar cita"
            >

              <i class="fa-solid fa-trash"></i>

            </button>

          </div>

        </div>

      </div>

    `;

  });

  container.innerHTML =
    html ||
    `
      <p class="text-gray-400 italic p-8 text-center">
        No hay citas próximas
      </p>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
  showSection('home');
});

async function executeETL() {

    try {

      const res =
      await fetch(

        baseUrl + '/etl',

        {
          method: 'POST'
        }

      );

      const data =
      await res.json();

      alert(

        `${data.message}

    Registros importados:
    ${data.imported}`

        );

      }

      catch (e) {

        alert(
          'Error ejecutando ETL'
        );

        console.error(e);

      }

}