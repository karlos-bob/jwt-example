import React, { FC, useState, useContext, useEffect } from 'react';
import LoginForm from "./components/LoginForm";
import { Context } from "./index";
import { observer } from "mobx-react-lite";
import { IUser } from "./models/IUser";
import UserService from "./services/user.service";

const App: FC = () => {
  const { store } = useContext(Context);
  const [users, setUsers] = useState<IUser[]>([]);
  
  useEffect(() => {
    if(localStorage.getItem('token')) {
      store.checkAuth();
    }
  }, [store]);
  
  async function getUsers() {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data);
    } catch(e) {
      console.log(e);
    }
  }
  
  if(store.isLoading) {
    return <div>Загрузка</div>
  }
  
  if(!store.isAuth) {
    return (
      <LoginForm />
    )
  }
  
  return (
      <div>
        <h1>
          { store.isAuth ?
            `Пользователь авторизован ${store.user.email}` :
            'АВТОРИЗИРУЙТЕСЬ'
          }
        </h1>
        <h1>{
          store.user.isActivated ?
            'Аккаунт подтвержден по почте' :
            'ПОДТВЕРДИТЕ АККАНУТ'
        }</h1>
        <button onClick={() => store.logout()}>
          Выйти
        </button>
        <div>
          <button onClick={getUsers}>
            Получить пользователей
           </button>
        </div>
        {users.map((user, i) => {
          return <div key={i}>{user.email}</div>
        })}
      </div>
  )
}

export default observer(App);