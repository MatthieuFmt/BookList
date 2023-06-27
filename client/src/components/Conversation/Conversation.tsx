import React from "react";

interface ConversationProps {
  userToSpeak: string;
  setShowConversation: React.Dispatch<React.SetStateAction<boolean>>;
}

const Conversation: React.FC<ConversationProps> = ({
  userToSpeak,
  setShowConversation,
}) => {
  return (
    <>
      <div className="layout" onClick={() => setShowConversation(false)}></div>

      <section className="conversation">
        <h4>{userToSpeak}</h4>

        <ul className="conversation__messages">
          <li className="conversation__message conversation__message--me">
            test
          </li>
          <li className="conversation__message conversation__message--other">
            test Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil
            sapiente quibusdam earum, ullam ipsum sit voluptatem impedit
            repudiandae excepturi, esse facere officiis? Tempore eum consectetur
            minus dolore consequuntur, deserunt harum, facere hic mollitia ipsam
            adipisci! Rem quam porro molestias dicta, sint quidem enim, quaerat
            velit harum vero in numquam delectus. Natus excepturi aliquam nobis
            pariatur nostrum. Perferendis laudantium pariatur, officia
            praesentium quia deleniti amet quidem consequuntur eius iure
            quibusdam atque, explicabo ad itaque voluptates id voluptatem at
            quaerat libero expedita.
          </li>
          <li className="conversation__message conversation__message--me">
            test
          </li>
          <li className="conversation__message conversation__message--other">
            test Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil
            sapiente quibusdam earum, ullam ipsum sit voluptatem impedit
            repudiandae excepturi, esse facere officiis? Tempore eum consectetur
            minus dolore consequuntur, deserunt harum, facere hic mollitia ipsam
            adipisci! Rem quam porro molestias dicta, sint quidem enim, quaerat
            velit harum vero in numquam delectus. Natus excepturi aliquam nobis
            pariatur nostrum. Perferendis laudantium pariatur, officia
            praesentium quia deleniti amet quidem consequuntur eius iure
            quibusdam atque, explicabo ad itaque voluptates id voluptatem at
            quaerat libero expedita.
          </li>
          <li className="conversation__message conversation__message--me">
            test
          </li>
          <li className="conversation__message conversation__message--other">
            test Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil
            sapiente quibusdam earum, ullam ipsum sit voluptatem impedit
            repudiandae excepturi, esse facere officiis? Tempore eum consectetur
            minus dolore consequuntur, deserunt harum, facere hic mollitia ipsam
            adipisci! Rem quam porro molestias dicta, sint quidem enim, quaerat
            velit harum vero in numquam delectus. Natus excepturi aliquam nobis
            pariatur nostrum. Perferendis laudantium pariatur, officia
            praesentium quia deleniti amet quidem consequuntur eius iure
            quibusdam atque, explicabo ad itaque voluptates id voluptatem at
            quaerat libero expedita.
          </li>
          <li className="conversation__message conversation__message--me">
            test
          </li>
          <li className="conversation__message conversation__message--other">
            test Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil
            sapiente quibusdam earum, ullam ipsum sit voluptatem impedit
            repudiandae excepturi, esse facere officiis? Tempore eum consectetur
            minus dolore consequuntur, deserunt harum, facere hic mollitia ipsam
            adipisci! Rem quam porro molestias dicta, sint quidem enim, quaerat
            velit harum vero in numquam delectus. Natus excepturi aliquam nobis
            pariatur nostrum. Perferendis laudantium pariatur, officia
            praesentium quia deleniti amet quidem consequuntur eius iure
            quibusdam atque, explicabo ad itaque voluptates id voluptatem at
            quaerat libero expedita.
          </li>
        </ul>

        <form>
          <input
            type="text"
            placeholder={`Ecrire un message à ${userToSpeak}`}
          />
          <button>Envoyer</button>
        </form>
      </section>
    </>
  );
};

export default Conversation;
