import "./App.css";
import React from "react";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import MetasquatchDapp from "./components";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/:path(|metasquatch-dapp)">
          <MetasquatchDapp {...metasquatchDappData} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
const metasquatchDappData = {
    title: "Breeding Grounds",
    connect: "Connect",
    mslogo1: "/img/mslogo-1@2x.png",
    land: "Forest",
    metasquatches: "Metasquatches",
    requires2Metasquatch1Land: "Requires 2 Metasquatch + 1 Forest",
    breed: "Breed",
    rewardPerMinis: "Rewards Per Day",
    canMint: "Can Mint?",
    website: "Website",
    discord: "https://discord.gg/mewd29xE8S",
    twitter: "https://twitter.com/METASQUATCH",
    opensea: "https://rarible.com/antisquatch/items",
    placeNum: 0,
    forest: "/img/land.png"
};

