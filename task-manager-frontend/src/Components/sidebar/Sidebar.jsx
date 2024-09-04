import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import sidebarService from "../../services/project";
import encryptionService from "../../services/encryption"

const Sidebar = () => {
  const [data, setData] = useState([]);


  useEffect(() => {
    const setSidebar = async () => {
      const dataset = [
        {
          name: "Homepage",
          isHomePage: true,
          _id: "/home",
        },
        {
          name: "My Projects",
          isLabel: true,
        },
      ];

      try {
        // Fetch my projects
        const myProjectsResponse = await sidebarService.getMyProjects();
        const myProjectsData = myProjectsResponse.map((item) => ({
          ...item,
          isMyProject: true,
        }));

        // Fetch collaborative projects
        const collabProjectsResponse = await sidebarService.getCollabProjects();
        const collabProjectsData = collabProjectsResponse.map((item) => ({
          ...item,
          isMyProject: false,
        }));

        // Combine datasets
        const newDataset = dataset
          .concat(myProjectsData)
          .concat({
            name: "Collab Projects",
            isLabel: true,
          })
          .concat(collabProjectsData);

        // Set the final combined dataset
        setData(newDataset);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    setSidebar();
  }, []);

  return (
    <div className="Sidebar">
      <ul className="SidebarList">
        {data.map((val, key) => (
          <li key={key} className="SidebarList row">
            {val._id ? (
              <Link
                to={
                  val.isHomePage
                    ? "/home"
                    : `/project/${encryptionService.encryptMessage(val._id)}`
                }
                className={
                  val.isHomePage
                    ? "HomePageButton"
                    : val.isLabel
                    ? "Label"
                    : val.isMyProject
                    ? "MyProject"
                    : "CollabProject"
                }
              >
                {val.name}
              </Link>
            ) : (
              <div className="Label">{val.name}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
