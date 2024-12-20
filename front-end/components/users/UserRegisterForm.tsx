//SNIPPET TWO



import { StatusMessage } from "@types";
import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useState } from "react";
import UserService from "services/UserService";
import { useTranslation } from "next-i18next";

const UserRegisterForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nickname, setNickName] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [nicknameError, setNickNameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });
  const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false); 
  const router = useRouter();
  const { t } = useTranslation("common");

  const clearErrors = () => {
    setNameError(null);
    setEmailError(null);
    setNickNameError(null);
    setPasswordError(null);
    setStatusMessages([]);
  };

  const validate = (): boolean => {
    let result = true;

    if (!name || name.trim() === "") {
      setNameError(t("register.validate.name"));
      result = false;
    }

    if (!email || email.trim() === "") {
      setEmailError(t("register.validate.email"));
      result = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(t("register.validate.emailInvalid"));
      result = false;
    }

    if (!nickname || nickname.trim() === "") {
      setNickNameError(t("register.validate.nickname"));
      result = false;
    }

    const { minLength, uppercase, number, specialChar } = passwordRequirements;
    if (!password || !minLength || !uppercase || !number || !specialChar) {
      setPasswordError(t("register.validate.password"));
      result = false;
    }

    return result;
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordRequirements({
      minLength: value.length >= 6,
      uppercase: /[A-Z]/.test(value),
      number: /\d/.test(value),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    });
  };

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    clearErrors();

    if (!validate()) return;

    try {
      const response = await UserService.registerUser({ name, email, nickname, password });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (response.status === 200 ) {
        try {
            const response2 = await UserService.loginUser({ nickname, password });

            if (!response2.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const loginData = await response2.json();
            
            if(response2.ok)
            {
              const { id, nickname, name, globalRole, token } = loginData;

              localStorage.setItem(
                  "loggedInUser",
                  JSON.stringify({ id, nickname, name, globalRole, token })
              );
            }
        } catch (error) {
            setStatusMessages([{ message: t("general.error"), type: "error" }]);
        }
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
      <h3 className="px-0">{t('register.title')}</h3>
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
          {t('label.name')}
        </label>
        <div className="block mb-2 text-sm font-medium">
          <input
            id="nameInput"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
          {nameError && <div className="text-red-800">{nameError}</div>}
        </div>

        <label htmlFor="emailInput" className="block mb-2 text-sm font-medium">
          {t('label.email')}
        </label>
        <div className="block mb-2 text-sm font-medium">
          <input
            id="emailInput"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
          {emailError && <div className="text-red-800">{emailError}</div>}
        </div>

        <label htmlFor="nicknameInput" className="block mb-2 text-sm font-medium">
          {t('label.nickname')}
        </label>
        <div className="block mb-2 text-sm font-medium">
          <input
            id="nicknameInput"
            type="text"
            value={nickname}
            onChange={(event) => setNickName(event.target.value)}
            className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
          {nicknameError && <div className="text-red-800">{nicknameError}</div>}
        </div>

        <label htmlFor="passwordInput" className="block mb-2 text-sm font-medium">
          {t('label.password')}
        </label>
        <div className="block mb-2 text-sm font-medium">
          <input
            id="passwordInput"
            type="password"
            value={password}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
            onChange={(event) => handlePasswordChange(event.target.value)}
            className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
          {isPasswordFocused && (
            <ul className="text-sm mt-2">
              <li className={classNames({ 'text-green-600': passwordRequirements.minLength, 'text-red-600': !passwordRequirements.minLength })}>
                {t('register.password.minLength')}
              </li>
              <li className={classNames({ 'text-green-600': passwordRequirements.uppercase, 'text-red-600': !passwordRequirements.uppercase })}>
                {t('register.password.uppercase')}
              </li>
              <li className={classNames({ 'text-green-600': passwordRequirements.number, 'text-red-600': !passwordRequirements.number })}>
                {t('register.password.number')}
              </li>
              <li className={classNames({ 'text-green-600': passwordRequirements.specialChar, 'text-red-600': !passwordRequirements.specialChar })}>
                {t('register.password.specialChar')}
              </li>
            </ul>
          )}
          {passwordError && <div className="text-red-800">{passwordError}</div>}
        </div>

        <button
          className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          type="submit"
        >
          {t('register.button')}
        </button>
      </form>
    </>
  );
};

export default UserRegisterForm;
