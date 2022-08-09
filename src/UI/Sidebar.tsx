import { useState, useEffect, SetStateAction, Dispatch } from "react";
import FolderRef from "../Classes/FolderRef";
import PageRef from "../Classes/PageRef";
import FolderList from "./FolderList";
import PageList from "./PageList";
import feather from "feather-icons";
import { Folder } from "../Classes/Folder";
import MiniButton from "./MiniButton";
import FullButton from "./FullButton";
import ResponsiveButton from "./ResponsiveButton";

const backIcon = feather.icons["corner-left-up"].toSvg({ "stroke-width": 2 });
const homeIcon = feather.icons["home"].toSvg({ "stroke-width": 2 });
const newFolderIcon = feather.icons["folder-plus"].toSvg({
  "stroke-width": 2,
  width: "24px",
});
const newPageIcon = feather.icons["edit"].toSvg({
  "stroke-width": 2,
  width: "24px",
});

type Props = {
  path: string[];
  setPath: Dispatch<SetStateAction<string[]>>;
  parent: Folder;
  pageRefs: PageRef[];
  setPageRefs: Dispatch<SetStateAction<PageRef[]>>;
  selectedPage: string | null;
  setSelectedPage: Dispatch<SetStateAction<string | null>>;
  deletePage: (title: string) => void;
};

export default function Sidebar({
  path,
  setPath,
  parent,
  pageRefs,
  setPageRefs,
  selectedPage,
  setSelectedPage,
  deletePage,
}: Props) {
  const [folderRefs, setFolderRefs] = useState(parent.folderRefGen());

  // When the parent changes, update displayed folders/pages.
  // State setter functions are guaranteed to have a stable identity per the docs.
  // Therefore, it's fine to include as a dependency.
  useEffect(() => {
    setFolderRefs(parent.folderRefGen());
    setPageRefs(parent.pageRefGen());
  }, [parent, setPageRefs]);

  /** Adds a temporary placeholder folderRef, pending naming and confirmation */
  const newFolder = () => {
    const newFolderRef = new FolderRef("New Folder", path, true);
    setFolderRefs([...folderRefs, newFolderRef]);
  };

  /*** Adds new folderRef to UI and new folder to parent object */
  const addFolder = (title: string) => {
    title = title.trim();
    if (parent.folders.some((folder) => folder.title === title)) {
      setFolderRefs(folderRefs.slice(0, folderRefs.length - 1));
      alert(
        "There's already a folder with this title.  Please use a different name."
      );
      return;
    }

    // autoname pages if no name is provided
    if (title.length === 0) {
      let latestFolder = 1;
      for (let i = 0; i < folderRefs.length; i++) {
        if (folderRefs[i].title === "Folder " + latestFolder) {
          latestFolder++;
          i = -1;
        }
      }
      title = "Folder " + latestFolder;
    }

    setFolderRefs(
      folderRefs
        .slice(0, folderRefs.length - 1)
        .concat(new FolderRef(title, parent.path))
    );
    parent.createChildFolder(title);
  };

  /** Adds a temporary placeholder pageRef. */
  const newPage = () => {
    // TODO check for empty string title
    const newPageRef = new PageRef("New Page", null);
    setPageRefs([...pageRefs, newPageRef]);
  };

  /*** Adds new pageRef to UI and new page to parent object.*/
  const addPage = (title: string) => {
    title = title.trim();
    // check for dentical page titles in same folder
    if (parent.pages.some((page) => page.title === title)) {
      setPageRefs(pageRefs.slice(0, pageRefs.length - 1));
      alert(
        "There's already a page with this title.  Please use a different name."
      );
      return;
    }

    // autoname pages if no name is provided
    if (title.length === 0) {
      let latestPage = 1;
      for (let i = 0; i < pageRefs.length; i++) {
        if (pageRefs[i].title === "Page " + latestPage) {
          latestPage++;
          i = -1;
        }
      }
      title = "Page " + latestPage;
    }

    setPageRefs(
      pageRefs
        .slice(0, pageRefs.length - 1)
        .concat(new PageRef(title, parent.path))
    );
    parent.createPage(title);
    setSelectedPage(title);
  };

  const deleteFolder = (title: string) => {
    parent.folders = parent.folders.filter((folder) => folder.title !== title);
    setFolderRefs(parent.folderRefGen());
  };

  return (
    // TODO when create new folder or page, scroll to comfortably view
    <div
      id="sidebar"
      className="h-full w-1/3 lg:w-[31%] overflow-auto border-r-2 border-zinc-500 dark:border-slate-100 select-none"
    >
      {/* Idea:
  Hover over parent, and arrow appears to the side, to show what clicking does.
   */}
      <div className="flex">
        <div
          id="parent-folder"
          onClick={() => {
            setSelectedPage(null);
            if (path.length > 1) setPath(path.slice(0, path.length - 1));
          }}
          className="flex items-center relative z-10 w-4/5 xl:w-[61%] rounded-br-2xl mr-3 py-3.5 px-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          <div
            id="back-icon"
            className="relative mr-1.5"
            dangerouslySetInnerHTML={{
              __html: path.length > 1 ? backIcon : homeIcon,
            }}
          />
          <div className="text-xl">{" " + parent.title}</div>
        </div>
        <div className="ml-auto mt-1 mr-3 py-1">
          <ResponsiveButton
            icon={newFolderIcon}
            func={newFolder}
            text="New Folder"
          />
        </div>
      </div>
      <div
        className={
          "relative z-10 flex justify-end w-full -mb-12 pr-3 pt-4 " +
          (pageRefs.length > 0 ? "hidden" : "visible")
        }
      >
        <ResponsiveButton icon={newPageIcon} func={newPage} text="New Page" />
      </div>

      <div id="sidebar-list" className="pb-10">
        <FolderList
          setPath={setPath}
          setSelectedPage={setSelectedPage}
          folderRefs={folderRefs}
          pageRefs={pageRefs}
          addFolder={addFolder}
          deleteFolder={deleteFolder}
        />

        <div
          className={
            "flex ml-8 mr-auto " + (pageRefs.length > 0 ? "visible" : "hidden")
          }
        >
          <div
            id="line"
            className={
              "relative z-0 -mb-40 bottom-32 right-3 w-3.5 h-40 border-l-2 border-b-2 rounded-bl-xl border-neutral-300 dark:border-gray-700 "
            }
          ></div>
          <div className="relative top-4 text-lg -ml-1 text-gray-900 dark:text-gray-300">
            Pages
          </div>
          <div className="relative top-1 ml-auto mr-3">
            <ResponsiveButton
              icon={newPageIcon}
              func={newPage}
              text="New Page"
            />
          </div>
        </div>

        <hr
          className={
            "w-11/12 m-auto mt-3 mb-4 border-t border-gray-600 " +
            (pageRefs.length > 0 ? "visible" : "hidden")
          }
        />
        <div className="flex justify-around">
          <div className="w-full xl:w-4/5 ml-7">
            <PageList
              pageRefs={pageRefs}
              addPage={addPage}
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
              deletePage={deletePage}
            />
          </div>
          <div className="mx-3 ml-4"></div>
        </div>
      </div>
    </div>
  );
}
