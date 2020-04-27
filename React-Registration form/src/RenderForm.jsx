import React, { useState } from 'react';
import { Input, Checkbox } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import {
  Formik, Form, Field, FieldArray, getIn,
} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import cn from 'classnames';

const AddButton = styled.button`
  padding: 0 5px;
  border-radius: 2px;
  color: rgba(0, 20, 255, 0.8);
  border: 1px solid transparent;
  cursor: pointer;
  background: none;
  outline: none;

  &:hover {
    border-radius: 10px;
    border: 1px solid rgba(0, 20, 255, 0.8);
  }
`;

const DeleteButton = styled.button`
  padding: 4px 10px;
  border-radius: 2px;
  color: rgba(255, 50, 0, 0.8);
  font-weight: bold;
  border: none;
  box-sizing: border-box;
  cursor: pointer;
  background: none;
`;

const Success = styled.div`
  text-align: center;
  width: 300px;
  padding: 30px;
  border-radius: 3px;
  box-shadow: 0 0 5px 5px rgba(130, 100, 170, 0.1);
  margin: 10vh auto;
`;

const Button = styled.button`
  padding: 5px 10px;
  border-radius: 3px;
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 2px 2px 10px rgba(100, 0, 255, 0.5);
  background: linear-gradient(45deg, rgba(255, 0, 0, 0.8), rgba(0, 0, 255, 0.5));

  &:hover {
    background: rgba(0, 0, 255, 0.6);
  }
`;

const schema = Yup.object().shape({
  name: Yup.string()
    .required('Обязательное поле')
    .max(50, 'не более 50 символов'),

  password: Yup.string()
    .required('Вы не написали пароль')
    .min(8, 'Должно быть не менее 8 символов')
    .matches(/(?=.*[0-9])/, 'Пароль должень содержать хотя бы одну цифру и заглавную букву')
    .matches(/(?=.*[a-z])/, 'Пароль должень содержать хотя бы одну букву латинского алфавита')
    .matches(
      /(?=.*[A-Z])/,
      'Пароль должень содержать хотя бы одну заглавную букву латинского алфавита',
    ),

  passwordConfirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Пароли не совподают'),

  email: Yup.string()
    .email('Email должен быть вида example@email.com')
    .required('Обязательное поле'),
  website: Yup.string()
    .required('Обязательное поле')
    .url(),
  age: Yup.number()
    .required('Обязательное поле')
    .min(18, 'Вам должно быть не менее 18')
    .max(65, 'Вам должно быть не более 65'),
  skills: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string()
          .min(4, 'Слишком короткое')
          .required('Обязательное поле'), // these constraints take precedence
      }),
    )
    .required('Must have skills'),
  acceptTerms: Yup.boolean(),
});

const RenderRegistrationForm = () => {
  const [isSuccess, setIsSaccess] = useState(false);

  const submit = async (values, { setErrors }) => {
    try {
      const responce = await axios.post('http://localhost:5000/sign-up', values);
      if (responce.data.userAded) {
        setIsSaccess(!isSuccess);
      }
    } catch (error) {
      const serverErrors = error.response.data.errors.reduce(
        (acc, item) => ({ ...acc, [item.param]: item.msg }),
        {},
      );
      if (serverErrors) {
        setErrors(serverErrors);
      }
    }
  };

  return isSuccess === true ? (
    <Success>
      <p>Вы успешно зарегистрированы.</p>
      <Button
        onClick={() => {
          setIsSaccess(!isSuccess);
          // return resetForm();
        }}
      >
        ok
      </Button>
    </Success>
  ) : (
    <Formik
      initialValues={{
        name: '',
        password: '',
        passwordConfirmation: '',
        email: '',
        website: '',
        age: '',
        skills: [''],
        acceptTerms: false,
      }}
      validationSchema={schema}
      onSubmit={submit}
      render={({
        values,
        touched,
        errors,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
      }) => (
        <Form className="form" onSubmit={handleSubmit}>
          <div className="marginBottom">
            <Input
              placeholder="Имя"
              value={values.name}
              prefix={<UserOutlined />}
              name="name"
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.name && touched.name && 'error'}
            />
            {errors.name && touched.name && <div className="input-feedback">{errors.name}</div>}
          </div>
          <div className="marginBottom">
            <Input.Password
              name="password"
              placeholder="Пароль"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.password && touched.password && 'error'}
            />
            {errors.password && touched.password && (
              <div className="input-feedback">{errors.password}</div>
            )}
          </div>
          <div className="marginBottom">
            <Input.Password
              name="passwordConfirmation"
              placeholder="Потвердите пароль"
              value={values.passwordConfirmation}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.passwordConfirmation && touched.passwordConfirmation && 'error'}
            />
            {errors.passwordConfirmation && touched.passwordConfirmation && (
              <div className="input-feedback">{errors.passwordConfirmation}</div>
            )}
          </div>
          <div className="marginBottom">
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.email && touched.email && 'error'}
            />
            {errors.email && touched.email && <div className="input-feedback">{errors.email}</div>}
          </div>
          <div className="marginBottom">
            <Input
              name="website"
              placeholder="Website"
              defaultValue="Ваш сайт"
              value={values.website}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.website && touched.website && 'error'}
            />
            {errors.website && touched.website && (
              <div className="input-feedback">{errors.website}</div>
            )}
          </div>
          <div className="marginBottom">
            <Input
              type="number"
              name="age"
              placeholder="Сколько вам лет"
              value={values.age}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.number && touched.number && 'error'}
            />
            {errors.age && touched.age && <div className="input-feedback">{errors.age}</div>}
          </div>
          <FieldArray
            className="marginBottom"
            name="skills"
            render={(arrayHelpers) => (
              <div>
                {values.skills.map((skill, index) => {
                  const name = `skills[${index}].name`;
                  const errorMessage = getIn(errors, name);
                  const classList = cn({
                    input: true,
                    error: errorMessage && touched.skills,
                  });
                  return (
                    <div className="marginBottom">
                      <Field name={name} placeholder="Навыки" className={classList} />
                      <DeleteButton type="button" onClick={() => arrayHelpers.remove(index)}>
                        X
                      </DeleteButton>
                      {errorMessage && touched.skills && (
                        <div className="input-feedback">{errorMessage}</div>
                      )}
                    </div>
                  );
                })}
                <AddButton type="button" onClick={() => arrayHelpers.push('')}>
                  + Добавить навык
                </AddButton>
              </div>
            )}
          />
          <div className="marginBottom">
            <Checkbox
              name="acceptTerms"
              checked={values.acceptTerms}
              onChange={handleChange}
              className={errors.acceptTerms && touched.acceptTerms && 'error'}
            >
              Я принемаю условия
            </Checkbox>
          </div>
          {errors.acceptTerms && touched.acceptTerms && (
            <div className="input-feedback">{errors.acceptTerms}</div>
          )}
          <Button type="submit" disabled={isSubmitting}>
            Регистрация
          </Button>
        </Form>
      )}
    />
  );
};

export default RenderRegistrationForm;
