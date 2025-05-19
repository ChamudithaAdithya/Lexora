import axios from "axios";


const useUserAuth = () => {
  const [token, setToken] = useState(null);
  const [user_id, setUserId] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user != null) {
      const parsedUser = JSON.parse(user);
      setToken(parsedUser.token);
      setUserId(parsedUser.user_id);
    }
  }, [token,user_id]);

  return { token, user_id };
};

class RoadmapService {
    // SaveRoadmap
    getUserId(){
      const userDatails = useUserAuth();
      return userDatails.user_id;
    }
}

const RoadmapServices = new RoadmapService();
export default RoadmapServices;