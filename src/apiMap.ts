// apiMap.ts
export const fetchZones = async () => {
  const token = localStorage.getItem("authToken");
  const response = await fetch("http://46.240.186.243:8000/kelner/layout/zones/fetch_zones", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch zones");
  }

  return response.json(); // Returns the array of zones
};

export const fetchTables = async () => {
  const token = localStorage.getItem("authToken");
  const response = await fetch("http://46.240.186.243:8000/kelner/layout/tables/fetch_tables", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status === 404) return [];
  if (!response.ok) throw new Error("Failed to fetch tables");

  return response.json();
};


export const createTable = async (zone_id: number, table_number: number, x: number, y: number) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch("http://46.240.186.243:8000/kelner/admin/objects/create_table", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ zone_id, table_number, x, y }),
  });

  if (!response.ok) {
    throw new Error("Failed to create table");
  }

  return response.json();
};

export const deleteTable = async (table_id: number) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`http://46.240.186.243:8000/kelner/admin/objects/detele_table/?table_id=${table_id}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete table");
  }

  return response.json();
};

export const createZone = async (zone_name: string) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch("http://46.240.186.243:8000/kelner/admin/objects/create_zone", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ zone_name, z: 0 }),
  });

  if (!response.ok) {
    throw new Error("Failed to create zone");
  }

  return response.json();
};


export const deleteZone = async (zone_id: number) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(
    `http://46.240.186.243:8000/kelner/admin/objects/delete_zone/?zone_id=${zone_id}`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete zone");
  }

  return response.json();
};

export const fetchObjects = async () => {
  const token = localStorage.getItem("authToken");
  const response = await fetch("http://46.240.186.243:8000/kelner/layout/objects/fetch_objects", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status === 404) return [];
  if (!response.ok) throw new Error("Failed to fetch objects");

  return response.json();
};

export const deleteObject = async (object_id: number) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(
    `http://46.240.186.243:8000/kelner/admin/objects/delete_object/?object_id=${object_id}`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete object");
  }

  return response.json();
};

export const createObject = async (
  zone_id: number,
  object_name: string,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch("http://46.240.186.243:8000/kelner/admin/objects/create_object", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ zone_id, object_name, x1, y1, x2, y2 }),
  });

  if (!response.ok) {
    throw new Error("Failed to create object");
  }

  return response.json();
};
