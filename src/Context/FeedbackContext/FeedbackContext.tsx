import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
} from "react";
import Feedback from "../../Components/Feedback/Feedback";

// Feedback type definition
type FeedbackType = {
  message: string;
  severity: "success" | "info" | "warning" | "error";
  open: boolean;
};

// Context type definition
type FeedbackContextType = {
  feedback: FeedbackType;
  setFeedback: (feedback: FeedbackType) => void;
};

// Create the context
const FeedbackContext = createContext<FeedbackContextType | undefined>(
  undefined
);

// Provider component
type FeedbackProviderProps = {
  children: ReactNode;
};

export const FeedbackProvider: React.FC<FeedbackProviderProps> = ({
  children,
}) => {
  const [feedback, setFeedback] = useState<FeedbackType>({
    message: "",
    severity: "info",
    open: false,
  });
  const handleCloseFeedback = () => {
    setFeedback({ message: "", severity: "info", open: false });
  };

  const value = useMemo(
    () => ({ feedback, setFeedback }),
    [feedback, setFeedback]
  );

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      <Feedback
        isOpen={feedback.open}
        onClose={handleCloseFeedback}
        severity={feedback.severity}
        message={feedback.message}
      />
    </FeedbackContext.Provider>
  );
};

// Custom hook for accessing the context
export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error("useFeedback must be used within a FeedbackProvider");
  }
  return context;
};
