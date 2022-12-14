import {
	useState,
	useEffect,
} from "react";
import {
	Box,
	Card,
	Container,
	IconButton,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TablePagination,
	TableRow,
	Tooltip,
	Typography,
} from "@mui/material";
import { DashboardLayout } from "../../components/DashboardSidebar/dashboard-layout";
import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";
import HeadComponent from "../../components/Head";
import { articleType } from "../../data/@types/articles";
import moment from "moment";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import AddTaskIcon from "@mui/icons-material/AddTask";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
	deleteArticle,
	getUsersArticles,
} from "../../store/api/articles";
import { ToolbarArticles } from "../../components/ToolbarArticles";
import { SeverityPill } from "../../components/DashboardSidebar/severity-pill";
import { switchColorStatus } from "../../utils/utilsPublications";
import { Loader } from "../../components/Loader";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import FormModal from "../../components/FormModal";
import { Alerts } from "../../components/Alert";
import ArticleIcon from "@mui/icons-material/Article";
import { Link } from "../../components/Navigation/Link";

const Customers = () => {
	const [openModal, setOpenModal] =
		useState<boolean>(false);
	const [articleId, setArticleId] =
		useState<string>("");
	const [open, setOpen] =
		useState<boolean>(false);
	const [alertTxt, setAlertTxt] =
		useState("");
	const [alertType, setAlertType] =
		useState("");
	const [articles, setArticles] =
		useState<articleType[]>([]);
	const [loading, setLoading] =
		useState(false);
	const [page, setPage] = useState(0);
	const [
		rowsPerPage,
		setRowsPerPage,
	] = useState(10);

	const handleChangePage = (
		event: unknown,
		newPage: number,
	) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setRowsPerPage(
			+event.target.value,
		);
		setPage(0);
	};

	const getArticles = async () => {
		setLoading(true);
		const articles =
			await getUsersArticles().finally(
				() => setLoading(false),
			);
		articles.length > 0 &&
			setArticles(articles);
	};

	useEffect(() => {
		getArticles();
	}, []);

	const Delete = async () => {
		const response =
			await deleteArticle(
				articleId,
			);
		if (response?.status === 204) {
			setOpenModal(false);
			getArticles();
			setOpen(true);
			setAlertTxt(
				"Artigo deletado com sucesso!",
			);
			setAlertType("success");
		}
	};
	return (
		<DashboardLayout>
			<HeadComponent title="Articles" />
			<Loader loading={loading} />
			<FormModal
				open={openModal}
				onClose={() =>
					setOpenModal(false)
				}
				onOpen={() =>
					setOpenModal(true)
				}
				onConfirm={Delete}
				type={"delete"}
			/>
			<Alerts
				open={open}
				text={alertTxt}
				vertical="top"
				horizontal="right"
				type={alertType}
				close={setOpen}
			/>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					py: 8,
					pt: 1,
				}}
			>
				<Container
					maxWidth={false}
				>
					<Box>
						<Typography
							variant="h5"
							component="h2"
							gutterBottom
						>
							Artigos
						</Typography>
					</Box>
					<ToolbarArticles />
					<Box sx={{ mt: 3 }}>
						<Card>
							<PerfectScrollbar>
								<Box
									width={
										"100%"
									}
									display="flex"
									overflow="auto"
								>
									<Table>
										<TableHead
											sx={{
												backgroundColor:
													"#42AF59",
												color: "#ffffff",
											}}
										>
											<TableRow>
												<TableCell
													
												>
													Title
												</TableCell>
												<TableCell
													
												>
													Categoria
												</TableCell>
												{/* <TableCell
													
												>
													Resumo
												</TableCell> */}
												<TableCell
													
												>
													Status
												</TableCell>
												<TableCell
													
												>
													Data
													de
													cria????o
												</TableCell>
												<TableCell
													sx={{
														width: "4%",
														pl: "27px",
														color: "#ffffff !important",
													}}
												>
													A????es
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{articles.length >
											0 ? (
												articles
													.slice(
														page *
															rowsPerPage,
														page *
															rowsPerPage +
															rowsPerPage,
													)
													.map(
														(
															article: articleType,
															key: number,
														) => (
															<TableRow
																hover
																key={
																	key
																}
															>
																<TableCell>
																	<Typography
																		color="textPrimary"
																		variant="body1"
																	>
																		{
																			article?.title
																		}
																	</Typography>
																</TableCell>
																<TableCell>
																	{article?.category ??
																		"N??o definido"}
																</TableCell>
																{/* <TableCell>
																	{article?.resume?.slice(
																		0,
																		90,
																	)}
																	{article
																		?.resume
																		?.length >
																		90 &&
																		"..."}
																</TableCell> */}
																<TableCell>
																	<SeverityPill
																		color={switchColorStatus(
																			article?.status,
																		)}
																	>
																		{
																			article?.status
																		}
																	</SeverityPill>
																</TableCell>
																<TableCell>
																	{article?.created_at &&
																		moment(
																			article?.created_at,
																		).format(
																			"DD/MM/YYYY HH:mm",
																		)}
																</TableCell>
																<TableCell
																	size="small"
																	sx={{
																		pr: "0px",
																	}}
																>
																	<Stack
																		direction="row"
																		justifyContent={
																			"flex-end"
																		}
																	>
																		<Tooltip
																			title="Editar artigo"
																			placement="top"
																		>
																			<IconButton
																				color="primary"
																				disabled={Boolean(
																					article?.status ===
																						"rejected",
																				)}
																			>
																				<Link
																					href={`/articles/${article?.id}`}
																					color="primary"
																					size="small"
																				>
																					<ModeEditOutlineIcon />
																				</Link>
																			</IconButton>
																		</Tooltip>
																		<Tooltip
																			title="Deletar artigo"
																			placement="top"
																		>
																			<IconButton
																				color="primary"
																				onClick={() => {
																					setOpenModal(
																						true,
																					);
																					setArticleId(
																						article?.id,
																					);
																				}}
																			>
																				<DeleteForeverIcon />
																			</IconButton>
																		</Tooltip>
																		<Tooltip
																			title="Detalhes do artigo"
																			placement="top"
																		>
																			<IconButton color="primary">
																				<ArticleIcon />
																			</IconButton>
																		</Tooltip>
																	</Stack>
																</TableCell>
															</TableRow>
														),
													)
											) : (
												<TableRow>
													<TableCell
														colSpan={
															8
														}
														align="center"
													>
														<InfoOutlinedIcon
															color="warning"
															fontSize="large"
														/>
														<Typography
															color="textPrimary"
															variant="body1"
														>
															Nenhum
															registro
															para
															exibir
														</Typography>
													</TableCell>
												</TableRow>
											)}
										</TableBody>
									</Table>
								</Box>
							</PerfectScrollbar>
							<TablePagination
								rowsPerPageOptions={[
									5,
									10,
									25,
									100,
								]}
								component="div"
								count={
									articles?.length ||
									0
								}
								rowsPerPage={
									rowsPerPage
								}
								page={
									page
								}
								onPageChange={
									handleChangePage
								}
								onRowsPerPageChange={
									handleChangeRowsPerPage
								}
							/>
						</Card>
					</Box>
				</Container>
			</Box>
		</DashboardLayout>
	);
};

export default Customers;


