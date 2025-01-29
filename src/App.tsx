import "./App.css";
import { Table } from "./Components/Table";
import { MatrixProvider } from "./Context/MatrixContext";

const App: React.FC = () => {
  return (
    <div className="mainComponent">
      <MatrixProvider>
        <div>
          <span className="textStyle">Interactive Matrix Table</span>
          <Table />
        </div>
      </MatrixProvider>
    </div>
  );
};

export default App;
