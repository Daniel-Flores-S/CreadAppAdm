import {
	Box,
	Button,
	Card,
	CardContent,
	FormControl,
	FormHelperText,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import { DashboardLayout } from "../../components/dashboard-layout";
import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";
import HeadComponent from "../../components/Head";
import { yupResolver } from "@hookform/resolvers/yup";
import {
	Controller,
	useForm,
} from "react-hook-form";
import {
	categorys,
	initial,
} from "../../utils/utilsPublications";
import { SchemaPublication } from "../../utils/validation/schemaPublication";
import DropZoneUpload from "../../components/DropZoneUpload";
import { Loader } from "../../components/Loader";
import {
	CategoryType,
	PublicationType,
} from "../../data/@types/publication";
import {
	createPublication,
	updatedFile,
} from "../../store/api/publication";
import { ModalConfirm } from "../../components/Modal";
import {
	useEffect,
	useState,
} from "react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { GetCategories } from "../../store/api/articles/categories";
import { categories } from "../../data/@types/categories";

const Customers = () => {
	const [open, setOpen] =
		useState(false);
	const { ["rica-adm.id"]: id } =
		parseCookies();
	const [categories, setCategories] =
		useState<categories[]>();

	const {
		register,
		handleSubmit,
		watch,
		reset,
		control,
		formState: {
			errors,
			isSubmitting,
		},
	} = useForm({
		resolver: yupResolver(
			SchemaPublication,
		),
		defaultValues: {
			...initial,
			user_id: id || "",
		},
	});

	const onSubmit = async (
		values: PublicationType,
	) => {
		const response =
			await createPublication(
				values,
			);
		if (response?.status === 200) {
			reset();
			setOpen(!open);
		}
	};

	const getCategory = async () => {
		const categories =
			await GetCategories();
		categories &&
			setCategories(
				categories?.data,
			);
	};

	useEffect(() => {
		getCategory();
	}, []);

	const handleClose = () =>
		setOpen(!open);
	return (
		<DashboardLayout>
			<HeadComponent title="Publications" />
			<Box
				component="form"
				sx={{
					flexGrow: 1,
					py: 2,
					px: 3,
				}}
				onSubmit={handleSubmit(
					onSubmit,
				)}
			>
				<ModalConfirm
					open={open}
					onClose={
						handleClose
					}
					onSubmit={
						handleClose
					}
					subTitle="Publicação cadastrada com sucesso"
				/>
				{isSubmitting && (
					<Loader
						loading={
							isSubmitting
						}
					/>
				)}
				<Box>
					<Typography
						variant="h5"
						component="h2"
						gutterBottom
					>
						Publicações
					</Typography>
				</Box>

				<Card sx={{ mb: 3 }}>
					<CardContent>
						<Grid
							container
							spacing={3}
						>
							<Grid
								item
								md={6}
								xs={12}
							>
								<TextField
									fullWidth
									label="Título"
									variant="outlined"
									helperText={
										errors
											.title
											?.message
									}
									error={
										errors.title !==
										undefined
									}
									{...register(
										"title",
									)}
								/>
							</Grid>
							<Grid
								item
								md={6}
								xs={12}
							>
								<FormControl
									fullWidth
								>
									<InputLabel
										error={
											errors?.category_id !==
											undefined
										}
									>
										Categoria
									</InputLabel>
									<Controller
										render={({
											field: {
												onChange,
												onBlur,
												value,
												name,
												ref,
											},
										}) => (
											<Select
												label="Categoria"
												value={
													value
												}
												name={
													name
												}
												onChange={
													onChange
												}
												onBlur={
													onBlur
												}
												inputRef={
													ref
												}
												error={
													errors?.category_id !==
													undefined
												}
											>
												<MenuItem value="">
													<em>
														Selecione
														uma
														categoria
													</em>
												</MenuItem>
												{categories?.map(
													(
														item,
														key: number,
													) => (
														<MenuItem
															key={
																key
															}
															value={
																item?.id
															}
														>
															{
																item?.name
															}
														</MenuItem>
													),
												)}
											</Select>
										)}
										name="category_id"
										control={
											control
										}
									/>
									{errors.category_id && (
										<FormHelperText
											error
										>
											{
												errors
													.category_id
													?.message
											}
										</FormHelperText>
									)}
								</FormControl>
							</Grid>
							<Grid
								item
								md={12}
								xs={12}
							>
								<FormControl
									fullWidth
								>
									<Typography
										variant="h6"
										color={
											"textSecondary"
										}
									>
										Resumo
									</Typography>
									<TextField
										fullWidth
										placeholder="Digite um pequeno resumo sobre a publicação"
										helperText={
											errors
												.resume
												?.message
										}
										error={
											errors.resume !==
											undefined
										}
										multiline
										rows={
											10
										}
										{...register(
											"resume",
										)}
										defaultValue="Default Value"
									/>
								</FormControl>
							</Grid>
							<Grid
								item
								md={12}
								xs={12}
							>
								<FormControl
									fullWidth
								>
									<DropZoneUpload
										file={watch(
											"file",
										)}
										{...register(
											"file",
										)}
									/>
								</FormControl>
							</Grid>
						</Grid>
					</CardContent>
				</Card>
				<Card
					sx={{
						p: 3,
					}}
				>
					<Box
						display="flex"
						justifyContent="center"
						alignItems="center"
						gap={5}
						p={3}
					>
						<Button
							fullWidth
							color="primary"
							variant="outlined"
							startIcon={
								<HighlightOffIcon />
							}
							onClick={() => {
								reset();
							}}
						>
							Limpar
							campos
						</Button>
						<Button
							fullWidth
							color="primary"
							variant="contained"
							startIcon={
								<AddCircleOutlineIcon />
							}
							type="submit"
						>
							Publicar
							artigo
						</Button>
					</Box>
				</Card>
			</Box>
		</DashboardLayout>
	);
};

export default Customers;

export const getServerSideProps: GetServerSideProps =
	async ctx => {
		const {
			["rica-adm.token"]: token,
		} = parseCookies(ctx);

		if (!token) {
			return {
				redirect: {
					destination:
						"/auth",
					permanent: false,
				},
			};
		}
		return {
			props: {},
		};
	};