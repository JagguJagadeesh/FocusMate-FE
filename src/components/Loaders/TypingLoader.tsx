import { Typewriter } from "../typewirter-text"
const TypingLoader = () => {
    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <Typewriter
                text={["Welcome to FocuMate", "Start learning today awesome websites."]}
                speed={100}
                loop={true}
                className="text-xl font-medium"
            />
        </div>
    )
}

export default TypingLoader 