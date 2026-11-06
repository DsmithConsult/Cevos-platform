import { useEffect, useState } from "react";

const getStoredProjects = () => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem("cevos-projects") || "[]");
  } catch (error) {
    console.warn("Failed to read saved projects", error);
    return [];
  }
};

export default function useProjectManagement() {
  const [projects, setProjects] = useState(getStoredProjects);
  const [selectedSavedProjectId, setSelectedSavedProjectId] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem("cevos-projects", JSON.stringify(projects));
    if (!projects.length) setSelectedSavedProjectId("");
    else if (!projects.some((project) => String(project.id) === selectedSavedProjectId)) {
      setSelectedSavedProjectId(String(projects[projects.length - 1].id));
    }
  }, [projects, selectedSavedProjectId]);

  const saveProject = (project) => {
    const nextProject = { ...project, id: project.id || Date.now(), updatedAt: new Date().toISOString() };
    setProjects((current) => project.id
      ? current.map((item) => item.id === project.id ? nextProject : item)
      : [...current, nextProject]);
  };
  const deleteProject = (projectId) => setProjects((current) => current.filter((project) => project.id !== projectId));
  const clearProjects = () => {
    if (typeof window !== "undefined") window.localStorage.removeItem("cevos-projects");
    setProjects([]);
  };
  const selectedSavedProject = projects.find((project) => String(project.id) === selectedSavedProjectId) || projects[projects.length - 1] || null;

  return { projects, selectedSavedProjectId, setSelectedSavedProjectId, selectedSavedProject, saveProject, deleteProject, clearProjects };
}
