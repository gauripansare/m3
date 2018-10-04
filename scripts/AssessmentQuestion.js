gRecordData = {
    Status: "NotStarted",
    AssessmentScore: "4",
    VisitedNumberOfPages: "0",
    LastVisitedPage: "", // UserSelectedOptionId will be used to jump to the unattempted question
    RecordTitle: "How Does Barbara Corcoran Pick Her Investments on Shark Tank?",
    LandingPageURL: "record2_landing.htm",
    QuestionSequence: "Numbers", // this can be used later if different display style is required
    OptionSequence: "LowerAlphabets", // this can be used later if different display style is required
    RandomizeQuestions: true,
    RandomizeOptions: true,
    Questions: [
                    {
                        QuestionId: "1",
                        QuestionText: "Which of the following allows you to search for files or folders?",
                        Options: [
                                     {
                                         "OptionId": "1",
                                         "OptionText": "Using the Help and Support window",
                                         "IsCorrect": false,

                                     },
                                     {
                                         "OptionId": "2",
                                         "OptionText": "Using the File Explorer Window",
                                         "IsCorrect": true,
                                         "score": 2
                                     },
                                     {
                                         "OptionId": "3",
                                         "OptionText": "Using the Search box in Word",
                                         "IsCorrect": false
                                     }

                        ],
                        IsAnswered:false,
                        CorrectFeedback: "That’s right. The File Explorer Window is one way to search for files and folders on your computer.",
                        IncorrectFeedback: "​That’s not right. The File Explorer Window is one way to search for files and folders on your computer.​",
                        "UserSelectedOptionId": ""

                    },
                    {
                        QuestionId: "2",
                        QuestionText: "If you want to compress a folder to share it with another person, what would you do?",
                        Options: [
                                     {
                                         "OptionId": "1",
                                         "OptionText": "Click and drag the file to a new drive",
                                         "IsCorrect": false,

                                     },
                                     {
                                         "OptionId": "2",
                                         "OptionText": "Right-click the file, point to Share and click the person you want to share the file with.",
                                         "IsCorrect": false
                                        
                                     },
                                     {
                                         "OptionId": "3",
                                         "OptionText": "Click the Share tab and then click Zip.",
                                         "IsCorrect": true,
                                         score: 2,


                                     }

                        ],
                        IsAnswered:false,
                        IncorrectFeedback: "That’s not right. The correct answer is to click the Share tab and click Zip.",
                        CorrectFeedback: "That’s right.​",
                        "UserSelectedOptionId": ""

                    },
                    {
                        QuestionId: "3",
                        QuestionText: "If you want to move a file from one folder to another on the same drive, what would you do?",
                        Options: [
                                     {
                                         "OptionId": "1",
                                         "OptionText": "Click and drag the file to the new folder.",
                                         "IsCorrect": true,
                                         score:2
                                        
                                     },
                                     {
                                         "OptionId": "2",
                                         "OptionText": "Click the file, press Ctrl+C, click the new folder, and press Ctrl+V.",
                                         "IsCorrect": false
                                     },
                                     {
                                         "OptionId": "3",
                                         "OptionText": "Right-click the file, and click Move to.",
                                         "IsCorrect": false
                                     }

                        ],
                        IsAnswered:false,
                        IncorrectFeedback: "​That’s not right. The correct answer is to click the file and drag the file to the new folder.",
                        CorrectFeedback: "That’s right.​",
                        "UserSelectedOptionId": ""

                    },
                    {
                        QuestionId: "4",
                        QuestionText: "If you want to copy a file from one folder to another, what would you do?",
                        Options: [
                                     {
                                         "OptionId": "1",
                                         "OptionText": "Click the file and click Copy to on the ribbon.",
                                         "IsCorrect": true,
                                         score: 2
                                     },
                                     {
                                         "OptionId": "2",
                                         "OptionText": "Click the file, press Ctrl+X, click the new folder, and press Ctrl+V.",
                                         "IsCorrect": false
                                     },
                                     {
                                         "OptionId": "3",
                                         "OptionText": "Right-click the file, and click Copy to.",
                                         "IsCorrect": false,
                                         
                                     }

                        ],
                        IsAnswered:false,
                        IncorrectFeedback: "​That’s not right. The correct answer is to click the file and click Copy to on the ribbon.​",
                        CorrectFeedback: "That’s right.​",
                        "UserSelectedOptionId": ""

                    }

    ]
}