interface Props {
  srcImg: string;
  altImg: string;
}

export const Avatar: React.FC<Props> = ({ srcImg, altImg }) => {
  return (
    <div>
      <img
        className="w-10 h-10 rounded"
        src={srcImg}
        alt={altImg}
      ></img>
    </div>
  );
};
