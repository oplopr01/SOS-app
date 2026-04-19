import SOSButton from "../components/SOSButton";

function HomePage() {
  return (
    <div style={styles.container}>
      <h1>🚨 Emergency Assistant</h1>
<p>Tap SOS to get help instantly</p>
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