import { ProgressProvider } from "./store";
import { QuestionScreen } from "./components/QuestionScreen";

function App() {
  return (
    <ProgressProvider>
      <QuestionScreen />
    </ProgressProvider>
  );
}

export default App;
