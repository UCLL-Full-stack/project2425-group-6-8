import { StatusMessage } from "@types";
import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useState } from "react";
import  UserService from "services/UserService";
import { useTranslation } from "next-i18next";

const UserLoginForm: React.FC = () => {
  const [nickname, setNickName] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNickNameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
  const router = useRouter();
  const { t } = useTranslation("common");
  
  const clearErrors = () => {
    setNickNameError(null);
    setPasswordError(null);
    setStatusMessages([]);
  };

  const validate = (): boolean => {
    let result = true;

    if (!nickname && nickname.trim() === "") {
      setNickNameError(t("login.validate.nickname"));
      result = false;
    }

    if (!password && password.trim() === "") {
      setPasswordError(t("login.validate.password"));
      result = false;
    }

    return result;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    clearErrors();

    if (!validate()) return;

    try {
      const response = await UserService.loginUser({ nickname, password });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (response.status === 200) {
        const { name, role, token } = data;

        localStorage.setItem(
          "loggedInUser",
          JSON.stringify({ name, role, token })
        );

        setStatusMessages([
          { message: t("login.success"), type: "success" },
        ]);

        setTimeout(() => router.push("/"), 2000);
      }
    } catch (error) {
      setStatusMessages([{ message: t("general.error"), type: "error" }]);
    }
  };

  return (
    <>
      <h3 className="px-0">{t('login.title')}</h3>
      {statusMessages && (
        <div className="row">
          <ul className="list-none mb-3 mx-auto">
            {statusMessages.map(({ message, type }, index) => (
              <li
                key={index}
                className={classNames({
                  "text-red-800": type === "error",
                  "text-green-800": type === "success",
                })}
              >
                {message}
              </li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <label htmlFor="nameInput" className="block mb-2 text-sm font-medium">
        {t('label.nickname')}
        </label>
        <div className="block mb-2 text-sm font-medium">
          <input
            id="nameInput"
            type="text"
            value={nickname}
            onChange={(event) => setNickName(event.target.value)}
            className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
          {nameError && <div className="text-red-800">{nameError}</div>}
        </div>
        <div className="mt-2">
          <div>
            <label htmlFor="passwordInput" className="block mb-2 text-sm font-medium">
            {t('label.password')}
            </label>
          </div>
          <div className="block mb-2 text-sm font-medium">
            <input
              id="passwordInput"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
            {passwordError && <div className="text-red-800">{passwordError}</div>}
          </div>
        </div>
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          type="submit"
        >
          {t('login.button')}
        </button>
      </form>
    </>
  );
};

export default UserLoginForm;
