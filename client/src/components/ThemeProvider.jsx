import { useSelector } from "react-redux"

export default function ThemeProvider({ children }) {
    const { theme } = useSelector(state => state.theme)
    return (
        <div className={theme}>
            <div className="dark:bg-black dark:text-white
            light: bg-white: text-black min-h-screen"
            >
                {children}
            </div>
        </div>
    );
}
