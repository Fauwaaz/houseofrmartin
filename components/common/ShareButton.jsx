import { Share2Icon } from "lucide-react";
import { useState } from "react";

const ShareButton = () => {
    const [tip, setTip] = useState("");

    const handleShare = async () => {
        const shareData = {
            title: document.title,
            text: "Check out this product!",
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                console.log("Thanks for sharing!");
            } catch (error) {
                console.log("Sharing canceled or failed:", error);
            }
        } else {
            // Desktop / unsupported browsers fallback
            try {
                await navigator.clipboard.writeText(shareData.url);
                setTip("Link copied! Share it anywhere.");
            } catch (err) {
                console.log("Failed to copy link:", err);
                setTip(`Copy this link manually: ${shareData.url}`);
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            className="rounded-full p-2 bg-white cursor-pointer"
            title="Share product"
        >
            <Share2Icon />
        </button>
    );
};

export default ShareButton;