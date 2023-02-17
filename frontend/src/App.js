import './App.css';
import Login from './containers/users/forms/Login';

function App() {
  return (
  <div className='min-h-screen bg-cyan-700 flex justify-center items-center'>
    <div className='py-12 px-12 bg-white rounded-2xl shadow-xl z-20'>
      <Login/>
    </div>
  </div>
  );
}

export default App;
