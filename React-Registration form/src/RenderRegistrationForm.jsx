import React from 'react';
import { Input, Select } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const { Option } = Select;
const { TextArea } = Input;

const selectBefore = (
  <Select defaultValue="http://" className="select-before">
    <Option value="http://">http://</Option>
    <Option value="https://">https://</Option>
  </Select>
);

const Form = styled.form`
	width: 400px;
	padding: 30px;
	border-radius: 3px;
	box-shadow: 0 0 5px 5px rgba(130, 100, 170, .1); 
	margin: 10vh auto;
	@media (max-width: 375px) {
		width: 300px;
	}
`;

const Button = styled.button`
	padding: 5px 10px;
	border-radius: 3px;
	color: white;
	border: none;
	cursor: pointer;
	box-shadow: 2px 2px 10px rgba(100, 0, 255,.5);
	background: linear-gradient(45deg, rgba(255, 0, 0,.8), rgba(0, 0, 255,.5));

	&:hover {
		background: rgba(0, 0, 255,.6);
	}
`;

const RenderRegistrationForm = () => {
	const formik = useFormik({
		initialValues: {
			name: "",
			password: "",
			passwordConfirmation: "",
			email: "",
			website: "",
			age: "",
			skills: "",
		},
		onSubmit: (values, { setSubmitting }) => {
			setTimeout(() => {
				axios.post('http://localhost:5000/sign-up', values)
				.then((responce) => console.log(responce.data));
			});
		},
		validationSchema: Yup.object().shape({
			name: Yup.string()
			.required("Обязательное поле"),

			password: Yup.string()
				.required("Вы не написали пароль")
				.min(8, "Должно быть не менее 8 символов")
				.matches(/(?=.*[0-9])/, "Пароль должень содержать хотя бы одну цифру"),

			passwordConfirmation: Yup.string()
				.oneOf([Yup.ref('password'), null], 'Пароли не совподают'),

			email: Yup.string()
				.email("Нужно написать правильный эмайл")
				.required("Обязательное поле"),
		}),
	});

	const {
		values,
		touched,
		errors,
		isSubmitting,
		handleChange,
		handleBlur,
		handleSubmit,
	} = formik;		

	return (
		<Form autoComplete="off" onSubmit={handleSubmit}>
			<div style={{ marginBottom: 16 }}>
				<Input placeholder="Имя"
					value={values.name}
					prefix={<UserOutlined/>}
					name="name"
					onChange={handleChange}
					onBlur={handleBlur}
					className={errors.name && touched.name && "error"}
				/>
				{errors.name && touched.name && (
					<div className="input-feedback">{errors.name}</div>
				)}
			</div>
			<div style={{ marginBottom: 16 }}>
				<Input.Password
					name="password"
					placeholder="Пароль"
					value={values.password}
					onChange={handleChange}
					onBlur={handleBlur}
					className={errors.password && touched.password && "error"}
				/>
				{errors.password && touched.password && (
					<div className="input-feedback">{errors.password}</div>
				)}
			</div>
			<div style={{ marginBottom: 16 }}>
				<Input.Password
					name="passwordConfirmation"
					placeholder="Потвердите пароль"
					value={values.passwordConfirmation}
					onChange={handleChange}
					onBlur={handleBlur}
					className={errors.passwordConfirmation && touched.passwordConfirmation && "error"}
				/>
				{errors.passwordConfirmation && touched.passwordConfirmation && (
					<div className="input-feedback">{errors.passwordConfirmation}</div>
				)}
			</div>
			<div style={{ marginBottom: 16 }}>
				<Input
					type="email"
					name="email"
					placeholder="Эмайл"
					value={values.email}
					onChange={handleChange}
					onBlur={handleBlur}
					className={errors.email && touched.email && "error"}
				/>
				{errors.email && touched.email && (
					<div className="input-feedback">{errors.email}</div>
				)}
			</div>
			<div style={{ marginBottom: 16 }}>
				<Input
					name="website"
					addonBefore={selectBefore}
					defaultValue="Ваш сайт"
					value={values.website}
					onChange={handleChange}
				/>
			</div>
			<div style={{ marginBottom: 16 }}>
				<Input
					type="number"
					name="age"
					placeholder="Сколько вам лет"
					value={values.age}
					onChange={handleChange}
				/>
			</div>
			<div style={{ marginBottom: 16 }}>
				<TextArea
					rows={4}
					name="skills"
					placeholder="Ваши навыки"
					value={values.skills}
					onChange={handleChange}
				/>
			</div>
			<Button type="submit" disabled={isSubmitting}>Регистрация</Button>
		</Form>
	)
};

export default RenderRegistrationForm;