import FileUploaded from '../components/FileUploaded';
import Navbar from '@/components/Navbar';
const Profil = () => {
  return (
    <div className="userProfil">
      <div>
        <Navbar />
      </div>
      Je suis dans mon profil
      <FileUploaded />
    </div>
  );
};

export default Profil;
