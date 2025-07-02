import React, { useState } from "react";
import Box from "@mui/joy/Box";
import Drawer from "@mui/joy/Drawer";
import ButtonGroup from "@mui/joy/ButtonGroup";
import Button from "@mui/joy/Button";
// import TextField from "@mui/joy/TextField";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import IconButton from "@mui/joy/IconButton";
import SendIcon from "@mui/icons-material/Send";
import Divider from "@mui/joy/Divider";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import TextField from "@mui/material/TextField";


const Chat: React.FC = () => {
  const [drawerState, setDrawerState] = useState<Record<string, boolean>>({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const [messages, setMessages] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState<any>("");

  const toggleDrawer =
    (anchor: string, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setDrawerState({ ...drawerState, [anchor]: open });
    };

  const sendMessage = () => {
    if (currentMessage.trim()) {
      setMessages((prev) => [...prev, currentMessage]);
      setCurrentMessage("");
    }
  };

  const chatBox = (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: 300,
        padding: 2,
      }}
    >
      <Typography mb={2}>Chat</Typography>
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          mb: 2,
          backgroundColor: "background.level2",
          padding: 1,
          borderRadius: "md",
        }}
      >
        {messages.map((msg, index) => (
          <Box key={index} sx={{ mb: 1, display: "flex" }}>
            <Typography
              sx={{
                backgroundColor: "primary.softBg",
                padding: 1,
                borderRadius: "md",
                maxWidth: "80%",
              }}
            >
              {msg}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TextField
          value={currentMessage}
          onChange={(e:any) => setCurrentMessage(e.target.value)}
          placeholder="Type your message..."
          fullWidth
        />
        <IconButton onClick={sendMessage} color="primary">
          <SendIcon />
        </IconButton>
      </Box>
    </Card>
  );

  const drawerList = (
    <Box role="presentation" sx={{ padding: 2 }}>
      <Typography mb={1}>
        Menu
      </Typography>
      <Divider />
      <List>
        {["Inbox", "Starred", "Send email", "Drafts"].map((text) => (
          <ListItem key={text}>
            <ListItemButton>{text}</ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text) => (
          <ListItem key={text}>
            <ListItemButton>{text}</ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <React.Fragment>
      <ButtonGroup variant="outlined">
        {["top", "right", "bottom", "left"].map((anchor) => (
          <Button key={anchor} onClick={toggleDrawer(anchor, true)}>
            Open {anchor}
          </Button>
        ))}
      </ButtonGroup>

      {["top", "right", "bottom", "left"].map((anchor) => (
        <Drawer
          key={anchor}
        //   anchor={anchor}
          open={drawerState[anchor]}
          onClose={toggleDrawer(anchor, false)}
        >
          {anchor === "right" ? chatBox : drawerList}
        </Drawer>
      ))}
    </React.Fragment>
  );
};

export default Chat;
