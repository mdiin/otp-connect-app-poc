import { StatusBar } from 'expo-status-bar';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useState, useEffect } from 'react';
import { Button, FlatList, Keyboard, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import axios from "axios";

const HOST = "192.168.50.2";
const PORT = "3000";

function SKUInput(props) {
  const { sku, updateSKU } = props;

  const value = sku.actual === undefined
    ? "0"
    : `${sku.actual}`;

  console.log("sku", sku);

  return (
    <SafeAreaView style={styles.skuInput.safeAreaView}>
      <Text style={styles.skuInput.text}>{sku.sku}: </Text>
      <TextInput style={styles.skuInput.textInput}
        clearTextOnFocus={true}
        onChangeText={(v) => updateSKU(sku.sku, parseInt(v))}
        onBlur={() => Keyboard.dismiss}
        value={value}
        keyboardType='numeric'
      />
    </SafeAreaView>
  )
}

function CycleCount(props) {
  const { cycleCount, submit } = props;

  const [currentCycleCount, setCurrentCycleCount] = useState(cycleCount);

  const updateSKU = (sku, count) => setCurrentCycleCount({
    ...currentCycleCount,
    skus: {
      ...currentCycleCount.skus,
      [`${sku}`]: {
        ...currentCycleCount.skus[sku],
        actual: count
      }
    }
  });

  console.log("currentCycleCount", JSON.stringify(currentCycleCount, null, 2));

  return (
    <View
      keyboardDismissMode='on-drag'
      style={styles.container}>
      <Text>Perform cycle count for the following SKUs</Text>
      <FlatList
        data={Object.values(currentCycleCount.skus)}
        renderItem={({ item }) => <SKUInput sku={item} updateSKU={updateSKU} />}
        keyExtractor={(item) => item.sku}
        keyboardDismissMode='interactive'
        onScrollBeginDrag={Keyboard.dismiss}
      />
      <Button onPress={() => submit(currentCycleCount)} title="Submit for approval" />
    </View>
  )
}

export default function App() {
  const [state, setState] = useState({});

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    const { secret, cycleCountId } = JSON.parse(data);

    try {
      const registerResult = await axios({
        method: "post",
        url: `http://${HOST}:${PORT}/register/${cycleCountId}`,
        headers: { "X-Secret": secret }
      });

      const { accessKey } = registerResult.data;

      const cycleCountResult = await axios({
        method: "get",
        url: `http://${HOST}:${PORT}/cycleCount/${cycleCountId}`,
        headers: { "X-Access-Key": accessKey }
      });

      const cycleCount = cycleCountResult.data;

      setState({
        ...state,
        accessKey,
        cycleCount
      })

    } catch (err) {
      console.log("err.status", err.response.status);
      if (err.response.status === 400) {
        alert("Code is expired, generate a new QR code");
      }

      if (err.response.status === 403) {
        alert("Access key found in QR code did not work. Your POC server is probably broken...");
      }
      console.log(JSON.stringify(err, null, 2));
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  if (state.cycleCount) {
    return (
      <View style={styles.container}>
        <CycleCount
          cycleCount={state.cycleCount}
          submit={async (cycleCount) => {
            try {

              await axios({
                method: "post",
                url: `http://${HOST}:${PORT}/submitForApproval/${cycleCount.id}`,
                headers: { "X-Access-Key": state.accessKey },
                data: cycleCount
              })

              setState({});
            } catch (err) {
              console.log("err.status", err.response.status);
              if (err.response.status === 400) {
                alert("Code is expired, generate a new QR code.\n\nYou have likely already submitted this CC, but the UI failed to update.\n\nResetting app state.");
                setState({});
              }

              if (err.response.status === 403) {
                alert("Access key found in QR code did not work. Your POC server is probably broken...\n\nResetting app state");
                setState({});
              }
              console.log(JSON.stringify(err, null, 2));
            }
          }}
        />
        <StatusBar style="auto" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title={`Tap to Scan Again`} onPress={() => setScanned(false)} />}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingBottom: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skuInput: {
    safeAreaView: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row'
    },
    textInput: {
      borderColor: 'black',
      borderStyle: 'solid',
      borderWidth: 2,
      margin: 5,
      fontSize: 32,
      minWidth: 64
    },
    text: {
      fontSize: 32
    }
  }
});
