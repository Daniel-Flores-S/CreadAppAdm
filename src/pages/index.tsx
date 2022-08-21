import { DashboardLayout } from "../components/dashboard-layout";
import { TasksProgress } from "../components/dashboard/tasks-progress";
import { TotalCustomers } from "../components/dashboard/total-customers";
import { TotalProfit } from "../components/dashboard/total-profit";
import HeadComponent from "../components/Head";
import {
	Box,
	Container,
	Grid,
} from "@mui/material";
import type { GetServerSideProps, NextPage } from "next";
import { Sales } from "../components/dashboard/sales";
import { TrafficByDevice } from "../components/dashboard/traffic-by-device";
import { Budget } from "../components/dashboard/budget";
import { LatestProducts } from "../components/dashboard/latest-products";
import { LatestOrders } from "../components/dashboard/latest-orders";
import { parseCookies } from "nookies";

const Home: NextPage = () => {
	return (
		<DashboardLayout>
			<HeadComponent title="Dashboard" />
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					py: 8,
				}}
			>
				<Container
					maxWidth={false}
				>
					<Grid
						container
						spacing={3}
					>
						<Grid
							item
							lg={3}
							sm={6}
							xl={3}
							xs={12}
						>
							<Budget />
						</Grid>
						<Grid
							item
							xl={3}
							lg={3}
							sm={6}
							xs={12}
						>
							<TotalCustomers />
						</Grid>
						<Grid
							item
							xl={3}
							lg={3}
							sm={6}
							xs={12}
						>
							<TasksProgress />
						</Grid>
						<Grid
							item
							xl={3}
							lg={3}
							sm={6}
							xs={12}
						>
							<TotalProfit
								sx={{
									height: "100%",
								}}
							/>
						</Grid>
						<Grid
							item
							lg={8}
							md={12}
							xl={9}
							xs={12}
						>
							<Sales />
						</Grid>
						<Grid
							item
							lg={4}
							md={6}
							xl={3}
							xs={12}
						>
							<TrafficByDevice
								sx={{
									height: "100%",
								}}
							/>
						</Grid>
						<Grid
							item
							lg={4}
							md={6}
							xl={3}
							xs={12}
						>
							<LatestProducts
								sx={{
									height: "100%",
								}}
							/>
						</Grid>
						<Grid
							item
							lg={8}
							md={12}
							xl={9}
							xs={12}
						>
							<LatestOrders />
						</Grid>
					</Grid>
				</Container>
			</Box>
		</DashboardLayout>
	);
};

export default Home;

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
