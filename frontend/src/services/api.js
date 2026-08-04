const API_URL = "http://localhost:5000/api";

export async function getVehicles() {
  const response = await fetch(`${API_URL}/vehicles`);

  return await response.json();
}

export async function getBatteries() {
  const response = await fetch(`${API_URL}/batteries`);

  return await response.json();
}

export async function getMotors() {
  const response = await fetch(`${API_URL}/motors`);

  return await response.json();
}

export async function saveProject(project) {
  const response = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(project)
  });

  return await response.json();
}
