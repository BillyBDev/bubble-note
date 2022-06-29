

export default function PageList (props) {
    const { pageRefs, addPage, setSelectedPage } = props;

    const pageStyles = "w-5/6 m-auto my-3 p-3 pl-6 border-2 border-zinc-900 dark:border-slate-100 rounded";

    const pages = pageRefs.map((item, index) => {
        // Condition for placeholder page
        if (item.path === null){
            return (
                <div className={pageStyles} key={index}>
                    <input 
                     type="text" 
                     placeholder="New Page"
                     autoFocus 
                     onBlur={(e) => {addPage(e.target.value)}}   
                     onKeyPress={(e) => {
                         // @ts-ignore
                         if (e.key === "Enter") addPage(e.target.value)
                     }} 
                     />
                </div>
            )
        } else {
            return <div onClick={() => {setSelectedPage(item.title)}} className={pageStyles} key={index}>{item.title}</div>
        }
    })
    return <div>{pages}</div>
}