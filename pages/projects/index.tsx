import Head from "next/head";
import React, { useEffect, useState, useMemo } from "react";
import FallInTextEntry from "../../components/FallInTextEntry";
import { HtmlTags } from "../../components/HtmlTags";
import Card from "../../components/ProjectCard";
import { ProjectDataArr } from "../../models/DataTypes";
import { data } from "../../repository/DataRepository";
import {
  addAnimationClass,
  removeAnimationClass,
} from "../../utils/CommonFunctions";
import styles from "../../styles/projects.responsive.module.css";
//import { repoURLs } from "../../utils/Constants";

type SortOption = "name" | "rating" | "downloads";

type TopicCategory = string;

function Projects(): JSX.Element {
  const [projectDataArr, setProjectArr] = useState<ProjectDataArr[]>([
    {},
    {},
    {},
  ]);
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [expandedCategories, setExpandedCategories] = useState<Set<TopicCategory>>(new Set<TopicCategory>());

  // Dynamic category order
  const categoryOrder = useMemo(() => {
    const categories = Object.keys(data.topicCategories || {});
    // Check if there are any topics that don't belong to defined categories
    const topics = new Set<string>();
    data.projects.forEach((project) => {
      if (project.topics && Array.isArray(project.topics)) {
        project.topics.forEach((topic: string) => topics.add(topic));
      }
    });

    let hasOtherTopics = false;
    Array.from(topics).forEach((topic) => {
      let foundCategory = false;
      for (const categoryTopics of Object.values(data.topicCategories || {})) {
        if (categoryTopics.includes(topic)) {
          foundCategory = true;
          break;
        }
      }
      if (!foundCategory) {
        hasOtherTopics = true;
      }
    });

    return hasOtherTopics ? [...categories, "Other"] : categories;
  }, []);

  // Dynamic category styles based on data
  const categoryStyles = useMemo(() => {
    const colors = [
      { border: "#7dd3fc", bg: "rgba(125, 211, 252, 0.12)", text: "#7dd3fc", chipBg: "rgba(125, 211, 252, 0.08)", chipBorder: "#7dd3fc" }, // Blue
      { border: "#f472b6", bg: "rgba(244, 114, 182, 0.12)", text: "#f472b6", chipBg: "rgba(244, 114, 182, 0.08)", chipBorder: "#f472b6" }, // Pink
      { border: "#34d399", bg: "rgba(52, 211, 153, 0.12)", text: "#34d399", chipBg: "rgba(52, 211, 153, 0.08)", chipBorder: "#34d399" }, // Green
      { border: "#c084fc", bg: "rgba(192, 132, 252, 0.12)", text: "#c084fc", chipBg: "rgba(192, 132, 252, 0.08)", chipBorder: "#c084fc" }, // Purple
      { border: "#facc15", bg: "rgba(250, 204, 21, 0.12)", text: "#facc15", chipBg: "rgba(250, 204, 21, 0.08)", chipBorder: "#facc15" }, // Yellow
      { border: "#94a3b8", bg: "rgba(148, 163, 184, 0.12)", text: "#94a3b8", chipBg: "rgba(148, 163, 184, 0.08)", chipBorder: "#94a3b8" }, // Gray
    ];

    const styles: Record<string, { border: string; bg: string; text: string; chipBg: string; chipBorder: string }> = {};
    categoryOrder.forEach((category, index) => {
      styles[category] = colors[index % colors.length];
    });
    return styles;
  }, [categoryOrder]);

  // Extract unique topics from all projects and group by category
  const groupedTopics = useMemo(() => {
    const topics = new Set<string>();
    data.projects.forEach((project) => {
      if (project.topics && Array.isArray(project.topics)) {
        project.topics.forEach((topic: string) => topics.add(topic));
      }
    });

    const grouped: Record<string, string[]> = {};
    categoryOrder.forEach((category) => {
      grouped[category] = [];
    });

    Array.from(topics).forEach((topic) => {
      let foundCategory = null;
      for (const [category, categoryTopics] of Object.entries(data.topicCategories || {})) {
        if (categoryTopics.includes(topic)) {
          foundCategory = category;
          break;
        }
      }
      const targetCategory = foundCategory || "Other";
      grouped[targetCategory].push(topic);
    });

    // Sort topics within each category
    Object.keys(grouped).forEach((key) => {
      grouped[key].sort();
    });

    return grouped;
  }, [categoryOrder]);

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = data.projects.filter((project) => {
      if (selectedTopics.size === 0) return true;
      if (!project.topics) return false;
      return project.topics.some((topic: string) => selectedTopics.has(topic));
    });

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "downloads":
          const aDownloads = parseInt(
            (a.download_count || "0").replace(/\D/g, "")
          );
          const bDownloads = parseInt(
            (b.download_count || "0").replace(/\D/g, "")
          );
          return bDownloads - aDownloads;
        case "name":
        default:
          return (a.name || "").localeCompare(b.name || "");
      }
    });

    return filtered;
  }, [selectedTopics, sortBy]);

  const toggleTopic = (topic: string) => {
    const newTopics = new Set(selectedTopics);
    if (newTopics.has(topic)) {
      newTopics.delete(topic);
    } else {
      newTopics.add(topic);
    }
    setSelectedTopics(newTopics);
  };

  const clearFilters = () => {
    setSelectedTopics(new Set());
  };

  const toggleCategory = (category: TopicCategory) => {
    if (expandedCategories.has(category)) {
      setExpandedCategories(new Set<TopicCategory>());
      return;
    }

    setExpandedCategories(new Set<TopicCategory>([category]));
  };

  useEffect(() => {
    setProjectArr(data.projects);

    const toAnimate = 2;
    const addAnimationClassReturn = addAnimationClass({ animate: 4 });

    return () => {
      clearInterval(addAnimationClassReturn.interval);
      for (let i = 0; i < toAnimate; i++) {
        removeAnimationClass({ index: addAnimationClassReturn.index[i] });
      }
    };

  }, []);
  

  return (
    <>
      <Head>
        <title>{`${data.intro.split(" ")[0]}'s Projects`}</title>
        <meta
          name="description"
          content={`Projects that ${data.intro} has previously worked on`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="true"
        />
      </Head>
      <div className="margin-left d-flex flex-column project-section-container">
        {/* Header with title and sort controls */}
        <div className={`d-flex align-items-center ${styles.projectsHeaderContainer}`}>
          <div className={`d-flex flex-row align-items-center ${styles.projectsTitleWrapper}`}>
            {HtmlTags(`<!--`, "white-space-nowrap")}
            {FallInTextEntry(
              "03. my projects",
              "subtitle secondary-font-color text-shadow"
            )}
            {HtmlTags(`-->`, "white-space-nowrap")}
          </div>

          {/* Sort Controls */}
          <div className={`d-flex align-items-center ${styles.projectsSortControls}`} style={{ gap: "10px" }}>
            <label htmlFor="sort-select" style={{ marginRight: "5px", whiteSpace: "nowrap",color: "var(--secondary-font-color)" }}>
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              style={{
                padding: "8px 12px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: "#1a1a1a",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              <option value="name">Name (A-Z)</option>
              <option value="rating">Rating (High to Low)</option>
              <option value="downloads">Downloads (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Filter and Topic Controls */}
        <div className="project-controls margin-top-2p">
          <div style={{ marginBottom: "10px" }}>
            <label style={{ marginRight: "10px", fontWeight: "bold",color: "var(--secondary-font-color)" }}>
              Filter by Topics:
            </label>
            {selectedTopics.size > 0 && (
              <button
                onClick={clearFilters}
                style={{
                  padding: "4px 8px",
                  marginLeft: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ff6b6b",
                  backgroundColor: "transparent",
                  color: "#ff6b6b",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Grouped Topics by Category */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
              {categoryOrder.map((category) => {
                const isExpanded = expandedCategories.has(category);
                const stylesConfig = categoryStyles[category];
                return (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "20px",
                      border: isExpanded ? `2px solid ${stylesConfig.border}` : `1px solid ${stylesConfig.border}`,
                      backgroundColor: isExpanded ? stylesConfig.bg : "transparent",
                      color: stylesConfig.text,
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "600",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginLeft: "0" }}>
              {categoryOrder.flatMap((category) => {
                if (!expandedCategories.has(category)) return [];
                const stylesConfig = categoryStyles[category];
                return groupedTopics[category].map((topic) => (
                  <button
                    key={`${category}-${topic}`}
                    onClick={() => toggleTopic(topic)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      border: selectedTopics.has(topic) ? `2px solid ${stylesConfig.border}` : `1px solid ${stylesConfig.chipBorder}`,
                      backgroundColor: selectedTopics.has(topic) ? stylesConfig.bg : stylesConfig.chipBg,
                      color: selectedTopics.has(topic) ? stylesConfig.text : stylesConfig.text,
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: selectedTopics.has(topic) ? "600" : "400",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {topic}
                  </button>
                ));
              })}
            </div>
          </div>

          {/* Results Count */}
          <div style={{ marginTop: "15px", color: "#ccc", fontSize: "14px" }}>
            Showing {filteredAndSortedProjects.length} of {data.projects.length}{" "}
            projects
          </div>
        </div>

        {/* Projects Grid */}
        <div className="d-grid projects-container margin-top-2p">
          {filteredAndSortedProjects.length > 0 ? (
            filteredAndSortedProjects.map((item, index) => {
              return (
                <Card
                  key={index}
                  name={item.name}
                  description={item.description}
                  rating={item.rating}
                  topics={item.topics}
                  web_link_url={item.web_link_url}
                  android_url={item.android_url}
                  windows_url={item.windows_url}
                  homepage={item.homepage}
                  download_count={item.download_count}
                />
              );
            })
          ) : (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "40px 20px",
                color: "#ccc",
              }}
            >
              <p>No projects found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Projects;
