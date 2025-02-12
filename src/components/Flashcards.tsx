import { FlashCardArray } from "react-flashcards";

const Flashcards: React.FC<{ flashcards: { term: string; definition: string }[] }> = ({ flashcards }) => {
    const formattedFlashcards = flashcards.map((card, index) => ({
        id: index + 1,
        front: <h2 className="font-semibold text-xl mx-2">{card.term}</h2>,
        back: <p className="mx-2">{card.definition}</p>,
        showBookMark: false,
        showTextToSpeech: false,
        timerDuration: 0, // Required property
        label: "", // Required property
        currentIndex: index,
         
    }));

    return (
        <div className="mb-4">
            <h3 className="font-medium mb-4 text-[#008585]">Flashcards</h3>
            <FlashCardArray
                width="75%"
                cards={formattedFlashcards}
                label="Flashcards"
                timerDuration={5} // Set a default timer duration at the component level
                controls={true}
                showCount={true}
                autoPlay={false}
                
                
            />
        </div>
    );
};

export default Flashcards;
