import SOSButton from "../components/SOSButton";

function HomePage() {
  return (
    <div style={styles.container}>
      <h1>Emergency Help</h1>
      <SOSButton />
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
};

export default HomePage;