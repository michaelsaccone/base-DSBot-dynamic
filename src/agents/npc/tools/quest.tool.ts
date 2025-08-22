import {AgentTool, property, schema, Tool} from "@apeyron-engineering/apeyron-ai-framework";


enum QuestType {
    APPLE = "apple",
    DUNGEON = "dungeon",
}

@schema()
class QuestSchema {

    @property("The type of the quest. MUST be one of: ['apple', 'dungeon']")
    type: QuestType;
}

class QuestTool extends AgentTool {

    @Tool(`
        Assign a quest to the player.
        Use this tool when the conversation goes about doing some action or getting a quest.
        The game has two kinds of quests: 'apple' that envolves gathering apples, 'dungeon' that requires
        the player to explore a cave. Based on the conversation, choose the quest wisely.
    `)
    async assignQuest(quest: QuestSchema) {
        return "QUEST_ASSIGN: " + quest.type;
    }
}

export default QuestTool;
